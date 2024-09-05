import { ColoredLoader } from "../../../components/global/loader";
import { usePrivacyPolicyQuery } from "../../../services/helpInfoSlice";
import Container from "./components/container";

export const Privacy = () => {
  const { data, error, isLoading } = usePrivacyPolicyQuery();

  if (isLoading)
    return (
      <Container>
        <div className="w-full flex justify-center items-center">
          <ColoredLoader />
        </div>
      </Container>
    );
  if (error) {
    throw new Error("An error occurred!");
  }

  const textContent = data?.data?.body;
  return (
    <Container>
      <div className="w-full mx-auto max-w-screen-md">
        <h2 className="text-[#101828] font-bold text-2xl sm:text-4xl text-center ">
          TalkAM Privacy Policy
        </h2>
        {data?.data && (
          <div
            className="mt-9 md:mt-14 xl:mt-[85px]  mb-7 md:mb-12"
            dangerouslySetInnerHTML={{ __html: textContent }}
          ></div>
        )}
      </div>
    </Container>
  );
};
