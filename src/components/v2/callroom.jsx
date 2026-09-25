import { useEffect, useState } from "react";
import classNames from "classnames";
import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from "agora-rtc-react";
import { useLazyJoinBookingQuery, useLeaveBookingMutation } from "../../services/v2/employeeApiSlice";
import { useGetMeV2Query } from "../../services/v2/authApiSliceV2";
import { apiErrorMessage } from "../../routes/v2/business/auth/authlayout";

const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID;

/** Camera-off / mic-off crossed-out icon, shared by both control buttons. */
const SlashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
  </svg>
);

/** Small muted-mic badge overlaid on a participant's own tile — the big
 *  red control-bar button only shows your own state and only if you look
 *  down there; this is the at-a-glance "who's muted right now" signal,
 *  for either side, directly on their video. */
const MicOffBadge = ({ className }) => (
  <span
    className={classNames(
      "absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0A1220] bg-[#AC4242]",
      className
    )}
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    </svg>
  </span>
);

/** The "someone's actually talking" bubble — two staggered expanding rings
 *  behind an avatar circle, only while Agora's volume indicator reports that
 *  uid above the speaking threshold. Sits inside a `relative` ancestor sized
 *  to the avatar itself (every call site below is already that), growing
 *  outward via negative inset rather than needing its own fixed size. */
const SpeakingPulse = ({ active }) =>
  active ? (
    <>
      <span
        className="absolute -inset-2 -z-10 animate-ping rounded-full bg-[#3BA88F]/40"
        style={{ animationDuration: "1.2s" }}
      />
      <span
        className="absolute -inset-2 -z-10 rounded-full bg-[#3BA88F]/25"
        style={{ animation: "ping 1.2s cubic-bezier(0,0,0.2,1) 0.3s infinite" }}
      />
    </>
  ) : null;

const HONORIFICS = ["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof."];

/** Avatar-fallback initials. A name starting with "Anonymous" (the
 *  therapist's-eye view of a client, per §11 privacy) always reduces to
 *  "AN" rather than the nonsensical "A·" a literal word-split would give
 *  "Anonymous · #4021". Any real name uses its own first two words. */
const initialsFor = (name) => {
  const trimmed = (name || "").trim();
  if (!trimmed) return "?";
  if (/^anonymous\b/i.test(trimmed)) return "AN";

  return trimmed
    .split(/\s+/)
    .filter((w) => !HONORIFICS.includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("") || "?";
};

/**
 * Fetches real Agora join credentials for the booking, then hands off to the
 * actual call room once they land. Kept separate from CallRoom so the Agora
 * client/provider only exist once we truly have somewhere to join — there's
 * nothing to publish/subscribe to before that.
 *
 * `bookingId` + `/user/bookings/{id}/join` work for either session
 * participant (client or therapist) — the backend resolves the caller's role
 * from the token, so this is shared by both dashboards.
 */
export const CallScreen = ({ bookingId, format, counterpartName, onExit }) => {
  const [fetchJoin, { data: joinData, isFetching, isError, error }] = useLazyJoinBookingQuery();
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));

  useEffect(() => {
    if (bookingId) fetchJoin(bookingId);
    // fetchJoin (RTK Query's trigger fn) is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  if (isError) {
    return (
      <div className="fixed inset-0 z-[600] flex flex-col items-center justify-center gap-4 bg-[#0A1220] px-8 text-center">
        <div className="text-[15px] font-boldNunito text-white">Couldn&apos;t connect to the call</div>
        <div className="text-[12.5px] text-white/50">
          {apiErrorMessage(error, "Something went wrong reaching the call service.")}
        </div>
        <button
          type="button"
          onClick={onExit}
          className="mt-2 h-[42px] cursor-pointer rounded-[10px] bg-white/[0.12] px-6 text-[13px] font-boldNunito text-white"
        >
          Close
        </button>
      </div>
    );
  }

  if (isFetching || !joinData || !AGORA_APP_ID) {
    return (
      <div className="fixed inset-0 z-[600] flex flex-col items-center justify-center gap-3 bg-[#0A1220]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <div className="text-[13px] text-white/50">Connecting…</div>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <CallRoom
        bookingId={bookingId}
        format={format}
        counterpartName={counterpartName}
        joinData={joinData}
        onExit={onExit}
      />
    </AgoraRTCProvider>
  );
};

/** The actual call room — real mic/camera tracks, real join, real remote
 *  participant. Only ever mounted once join credentials exist. */
const CallRoom = ({ bookingId, format, counterpartName, joinData, onExit }) => {
  const { data: me } = useGetMeV2Query();
  const client = useRTCClient();
  const uid = me?.id;

  const isVideo = format === "video";
  const counterpartInitials = initialsFor(counterpartName);
  // Never anonymised — you always know your own name, regardless of what
  // the other participant is shown of you.
  const myInitials = initialsFor(me?.name);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(isVideo);
  // Which tile is the big "main" one — clicking either tile swaps them.
  // Positioning-only (see the two tiles below): the underlying RemoteUser/
  // LocalVideoTrack elements stay mounted throughout, just repositioned via
  // class, so swapping never interrupts the actual audio/video pipeline.
  const [pinnedSelf, setPinnedSelf] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [ending, setEnding] = useState(false);
  const [remainingMs, setRemainingMs] = useState(null);
  const [leaveBooking] = useLeaveBookingMutation();

  // The session's scheduled due time — starts_at + duration_minutes, exactly
  // what the backend's own sweep()/leave() completion checks use.
  const dueAt = joinData?.starts_at && joinData?.duration_minutes
    ? new Date(String(joinData.starts_at).replace(" ", "T")).getTime()
      + joinData.duration_minutes * 60000
    : null;

  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack(true);
  const { localCameraTrack, error: camError } = useLocalCameraTrack(isVideo);

  usePublish([localMicrophoneTrack, isVideo ? localCameraTrack : null].filter(Boolean));

  const { isConnected } = useJoin(
    {
      appid: AGORA_APP_ID,
      channel: joinData.channel_ref,
      token: joinData.token,
      uid,
    },
    !!uid
  );

  const remoteUsers = useRemoteUsers();
  const remoteUser = remoteUsers[0];

  // Per-uid mic volume (0-100), Agora's own "who's actually talking right
  // now" signal — covers both the local mic and every remote publisher in
  // one subscription, polled internally by the SDK (~200ms) rather than
  // us reading getVolumeLevel() off each track ourselves.
  const [volumeByUid, setVolumeByUid] = useState({});
  useEffect(() => {
    client.enableAudioVolumeIndicator();
    const onVolume = (volumes) => {
      setVolumeByUid((prev) => {
        const next = { ...prev };
        volumes.forEach(({ uid: vUid, level }) => {
          // Agora reports the LOCAL user's own volume under uid 0, never the
          // actual join uid — remap it so isSpeaking(uid) below can find it.
          next[vUid === 0 ? uid : vUid] = level;
        });
        return next;
      });
    };
    client.on("volume-indicator", onVolume);
    return () => client.off("volume-indicator", onVolume);
  }, [client, uid]);

  const SPEAKING_THRESHOLD = 5;
  const isSpeaking = (vUid) => (volumeByUid[vUid] ?? 0) > SPEAKING_THRESHOLD;
  const iAmSpeaking = micOn && isSpeaking(uid);
  const remoteIsSpeaking = !!remoteUser && remoteUser.hasAudio !== false && isSpeaking(remoteUser.uid);

  useEffect(() => {
    localMicrophoneTrack?.setEnabled(micOn);
  }, [micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (isVideo) localCameraTrack?.setEnabled(cameraOn);
  }, [isVideo, cameraOn, localCameraTrack]);

  useEffect(() => {
    if (!isConnected) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isConnected]);

  // Ticks toward the session's due time regardless of connection state — a
  // dropped connection right before the end still needs the countdown (and
  // the auto-leave it drives) to keep going.
  useEffect(() => {
    if (!dueAt) return undefined;
    const tick = () => setRemainingMs(dueAt - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dueAt]);

  const label = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const permissionBlocked = Boolean(micError) || (isVideo && Boolean(camError));

  const endCall = async () => {
    if (ending) return;
    setEnding(true);
    try {
      localMicrophoneTrack?.close();
      localCameraTrack?.close();
      await client.leave();
    } catch {
      /* Best-effort teardown — still exit either way. */
    }
    // Best-effort — if this never lands, the AV webhook's whole-channel-
    // destroyed event (or the per-minute sweep, once due time passes) still
    // catches it, just later.
    if (bookingId) leaveBooking(bookingId).catch(() => {});
    onExit();
  };

  const remainingSeconds = remainingMs !== null ? Math.max(0, Math.round(remainingMs / 1000)) : null;
  const showCountdown = remainingSeconds !== null && remainingSeconds <= 300;
  const countdownLabel = remainingSeconds !== null
    ? `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`
    : null;

  // Auto-leave once the due time is reached — mirrors clicking "End call".
  useEffect(() => {
    if (remainingMs !== null && remainingMs <= 0 && !ending) {
      endCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, ending]);

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-[#0A1220]">
      <div className="flex items-center justify-between px-[26px] py-5">
        <div className="flex items-center gap-2">
          <span
            className={classNames(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-[#3BA88F]" : "bg-[#AC4242]"
            )}
          />
          <span className="text-[13px] font-boldNunito text-white">
            {isConnected ? label : "Connecting…"}
          </span>
        </div>
        <span className="text-[12px] text-white/40">Encrypted · not recorded</span>
      </div>

      {showCountdown ? (
        <div className="flex justify-center px-[26px] pb-3">
          <span
            className={classNames(
              "rounded-full px-4 py-1.5 text-[12.5px] font-boldNunito text-white",
              remainingSeconds <= 60 ? "bg-[#AC4242]" : "bg-[#8A5A1F]"
            )}
          >
            Session ends in {countdownLabel}
          </span>
        </div>
      ) : null}

      {permissionBlocked ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
          <div className="text-[14px] font-boldNunito text-white">
            Camera/microphone access is blocked
          </div>
          <div className="text-[12px] leading-[1.6] text-white/50">
            Allow camera and microphone access for this site in your browser&apos;s address bar,
            then rejoin the session.
          </div>
        </div>
      ) : (
        <div className="relative flex flex-1 items-center justify-center">
          {isVideo ? (
            remoteUser ? (
              <>
                {/* Remote tile — main by default, corner when self is pinned.
                    RemoteUser stays mounted across the swap; only the
                    wrapper's size/position class changes, so audio/video
                    never interrupts. */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={pinnedSelf ? "Maximize their video" : "Their video (main view)"}
                  onClick={pinnedSelf ? () => setPinnedSelf(false) : undefined}
                  onKeyDown={pinnedSelf ? (e) => e.key === "Enter" && setPinnedSelf(false) : undefined}
                  className={classNames(
                    pinnedSelf
                      ? "absolute bottom-6 right-6 z-10 flex h-[100px] w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-2 border-white/[0.15] bg-[#1A2E5A]"
                      : "absolute inset-0 flex h-full w-full items-center justify-center"
                  )}
                >
                  {remoteUser.hasVideo ? (
                    <RemoteUser
                      user={remoteUser}
                      playVideo
                      playAudio
                      className="h-full w-full"
                    />
                  ) : (
                    // hasVideo false covers both "never published" and "camera
                    // toggled off mid-call" — RemoteUser's own `cover` prop only
                    // catches the former and renders a black frame for the
                    // latter, so this is handled explicitly instead. Audio still
                    // needs a mounted (hidden) RemoteUser to actually play.
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,#141B34,#0D2240)]">
                      <span
                        className={classNames(
                          "relative flex items-center justify-center rounded-full bg-[#017FC8] font-extraboldNunito text-white",
                          pinnedSelf ? "h-11 w-11 text-[15px]" : "h-[120px] w-[120px] text-[40px]"
                        )}
                      >
                        <SpeakingPulse active={remoteIsSpeaking} />
                        {counterpartInitials}
                      </span>
                      <RemoteUser user={remoteUser} playVideo={false} playAudio className="hidden" />
                    </div>
                  )}
                  {remoteUser.hasAudio === false ? (
                    <MicOffBadge className={pinnedSelf ? "right-1.5 top-1.5" : "right-4 top-4"} />
                  ) : null}
                  {pinnedSelf ? (
                    <span className="absolute bottom-1.5 left-2 text-[9px] font-boldNunito text-white/60">
                      {counterpartName || "THEM"}
                    </span>
                  ) : null}
                </div>

                {/* Self tile — corner by default, main when pinned. Same
                    swap-by-repositioning approach as the remote tile above. */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={pinnedSelf ? "Your video (main view)" : "Maximize your video"}
                  onClick={!pinnedSelf ? () => setPinnedSelf(true) : undefined}
                  onKeyDown={!pinnedSelf ? (e) => e.key === "Enter" && setPinnedSelf(true) : undefined}
                  className={classNames(
                    pinnedSelf
                      ? "absolute inset-0 flex h-full w-full items-center justify-center"
                      : "absolute bottom-6 right-6 z-10 flex h-[100px] w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-2 border-white/[0.15] bg-[#1A2E5A]"
                  )}
                >
                  {cameraOn && localCameraTrack ? (
                    <LocalVideoTrack track={localCameraTrack} play className="h-full w-full" />
                  ) : (
                    <span
                      className={classNames(
                        "relative flex items-center justify-center rounded-full bg-[#017FC8] font-extraboldNunito text-white",
                        pinnedSelf ? "h-[120px] w-[120px] text-[40px]" : "h-11 w-11 text-[15px]"
                      )}
                    >
                      <SpeakingPulse active={iAmSpeaking} />
                      {myInitials}
                    </span>
                  )}
                  {!micOn ? (
                    <MicOffBadge className={pinnedSelf ? "right-4 top-4" : "right-1.5 top-1.5"} />
                  ) : null}
                  {!pinnedSelf ? (
                    <span className="absolute bottom-1.5 left-2 text-[9px] font-boldNunito text-white/60">
                      YOU
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              // Nobody else has joined yet — nothing to show them against, so
              // your own feed fills the main view instead of being shrunk
              // into a corner next to an idle placeholder avatar.
              <div className="relative h-full w-full">
                {cameraOn && localCameraTrack ? (
                  <LocalVideoTrack track={localCameraTrack} play className="h-full w-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,#141B34,#0D2240)]">
                    <span className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#017FC8] text-[40px] font-extraboldNunito text-white">
                      <SpeakingPulse active={iAmSpeaking} />
                      {myInitials}
                    </span>
                  </div>
                )}
                {!micOn ? <MicOffBadge className="right-4 top-4" /> : null}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-[12px] text-white/70">
                  Waiting for {counterpartName || "them"} to join…
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-wrap items-start justify-center gap-6 px-6">
              {/* Their card */}
              <div className="flex w-[220px] flex-col items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-6 py-8">
                <div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[rgba(1,127,200,0.15)]">
                  <SpeakingPulse active={remoteIsSpeaking} />
                  <span className="absolute -inset-2.5 rounded-full border-2 border-[rgba(1,127,200,0.25)]" />
                  <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#017FC8] text-[26px] font-extraboldNunito text-white">
                    {counterpartInitials}
                  </span>
                  {remoteUser?.hasAudio === false ? <MicOffBadge className="-right-1 -top-1" /> : null}
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-extraboldNunito text-white">{counterpartName}</div>
                  <div className="text-[11px] text-white/40">
                    {remoteUser ? `Connected · ${label}` : "Waiting to join…"}
                  </div>
                </div>
              </div>

              {/* Your card */}
              <div className="flex w-[220px] flex-col items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-6 py-8">
                <div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[rgba(1,127,200,0.15)]">
                  <SpeakingPulse active={iAmSpeaking} />
                  <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#017FC8] text-[26px] font-extraboldNunito text-white">
                    {myInitials}
                  </span>
                  {!micOn ? <MicOffBadge className="-right-1 -top-1" /> : null}
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-extraboldNunito text-white">You</div>
                  <div className="text-[11px] text-white/40">Voice call</div>
                </div>
              </div>

              {remoteUser ? (
                <RemoteUser user={remoteUser} playVideo={false} playAudio className="hidden" />
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 p-7">
        <button
          type="button"
          onClick={() => setMicOn((v) => !v)}
          aria-label={micOn ? "Mute" : "Unmute"}
          className={classNames(
            "flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full",
            !micOn ? "bg-[#AC4242]" : "bg-white/[0.12]"
          )}
        >
          {!micOn ? <SlashIcon /> : <MicIcon />}
        </button>

        {isVideo ? (
          <button
            type="button"
            onClick={() => setCameraOn((v) => !v)}
            aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
            className={classNames(
              "flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full",
              cameraOn ? "bg-white/[0.12]" : "bg-[#AC4242]"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </button>
        ) : null}

        <button
          type="button"
          onClick={endCall}
          disabled={ending}
          aria-label="End call"
          className="flex h-[52px] w-[60px] cursor-pointer items-center justify-center rounded-[26px] bg-[#AC4242] disabled:opacity-60"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" stroke="none">
            <path d="M21.5 15.9l-3.8-1.1c-.5-.1-1 0-1.3.4l-1.7 1.7c-2.5-1.3-4.6-3.4-5.9-5.9l1.7-1.7c.4-.4.5-.9.4-1.3L9.8 4.2c-.2-.6-.8-1-1.4-.9L4.7 4C4 4.1 3.5 4.7 3.5 5.4 3.9 14 10.2 20.1 18.6 20.5c.7 0 1.3-.5 1.4-1.2l.7-3.7c.1-.6-.3-1.2-.9-1.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
