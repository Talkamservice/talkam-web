import { ColoredLoader } from "../../../components/global/loader";
import { useTermsOfUseQuery } from "../../../services/helpInfoSlice";
import Container from "./components/container";

export const Terms = () => {
  const { data, error, isLoading } = useTermsOfUseQuery();

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

  function stripHtmlTags(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.innerText || tempElement.textContent || "";
  }

  const textContent = stripHtmlTags(data?.data?.body);

  console.log(data);
  return (
    <Container>
      <div className="w-full mx-auto max-w-screen-md">
        <h2 className="text-[#101828] font-bold text-2xl sm:text-4xl text-center ">
          TalkAM Terms of Use
        </h2>
        {data?.data.length > 0 && (
          <div className="mt-9 md:mt-14 xl:mt-[85px]">{textContent}</div>
        )}
      </div>
    </Container>
  );
};
