import { ColoredLoader } from "../../../components/global/loader";
import { useRulesQuery } from "../../../services/helpInfoSlice";

import Container from "./components/container";

export const Rules = () => {
  const { data, error, isLoading } = useRulesQuery();

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

  return (
    <Container>
      <div className="w-full mx-auto max-w-screen-md">
        <h2 className="text-[#101828] font-bold text-2xl sm:text-4xl text-center ">
          TalkAM Rules
        </h2>
        {data?.data.length > 0 && (
          <div className="mt-9 md:mt-14 xl:mt-16  mb-7 md:mb-12">
            <h2 className=" text-lg font-bold md:text-[22px] text-[#444444]">
              Community Guidelines
            </h2>
            <div className="space-y-5 mt-8">
              {data?.data.map((item, index) => (
                <div key={index}>
                  <h3 className="font-bold text-base md:text-lg text-[#444444] leading-5 md:leading-6 ">
                    <span>{index + 1}. </span>
                    {item.title}
                  </h3>
                  <p className="text-[#444444] text-base md:text-lg pl-5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};
