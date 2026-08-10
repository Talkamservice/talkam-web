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
import { useLazyJoinBookingQuery } from "../../services/v2/employeeApiSlice";
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
      <CallRoom format={format} counterpartName={counterpartName} joinData={joinData} onExit={onExit} />
    </AgoraRTCProvider>
  );
};

/** The actual call room — real mic/camera tracks, real join, real remote
 *  participant. Only ever mounted once join credentials exist. */
const CallRoom = ({ format, counterpartName, joinData, onExit }) => {
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
  const [seconds, setSeconds] = useState(0);
  const [ending, setEnding] = useState(false);

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
    onExit();
  };

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
                    <span className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#017FC8] text-[40px] font-extraboldNunito text-white">
                      {counterpartInitials}
                    </span>
                    <RemoteUser user={remoteUser} playVideo={false} playAudio className="hidden" />
                  </div>
                )}
                <div className="absolute bottom-6 right-6 flex h-[100px] w-[140px] items-center justify-center overflow-hidden rounded-[14px] border-2 border-white/[0.15] bg-[#1A2E5A]">
                  {cameraOn && localCameraTrack ? (
                    <LocalVideoTrack track={localCameraTrack} play className="h-full w-full" />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#017FC8] text-[15px] font-extraboldNunito text-white">
                      {myInitials}
                    </span>
                  )}
                  <span className="absolute bottom-1.5 left-2 text-[9px] font-boldNunito text-white/60">
                    YOU
                  </span>
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
                    <span className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#017FC8] text-[40px] font-extraboldNunito text-white">
                      {myInitials}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-[12px] text-white/70">
                  Waiting for {counterpartName || "them"} to join…
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-[18px]">
              <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-[rgba(1,127,200,0.15)]">
                <span className="absolute -inset-3.5 rounded-full border-2 border-[rgba(1,127,200,0.25)]" />
                <span className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#017FC8] text-[32px] font-extraboldNunito text-white">
                  {counterpartInitials}
                </span>
              </div>
              <div className="text-[16px] font-extraboldNunito text-white">{counterpartName}</div>
              <div className="text-[12px] text-white/40">
                {remoteUser ? `Voice call · ${label}` : "Waiting for them to join…"}
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
