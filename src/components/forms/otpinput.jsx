import React from 'react';
import OtpInput from 'react18-input-otp';

export const Otp = ({ value, onChange, numInputs, className }) => {
  return (
    <OtpInput
      className={className}
      value={value}
      onChange={onChange}
      numInputs={numInputs}
      isInputNum
      shouldAutoFocus
      separator={<span></span>}
      inputStyle="!w-8 !h-8 md:!w-16 md:!h-16 p-0 text-xl md:text-2xl text-tprimary-100 font-semibold rounded-[8px] border border-tgray-50 
        py-4 focus:ring-4 focus:ring-tblue-100 focus:border-tprimary-100 select-none"
      containerStyle="space-x-2 sm:space-x-4"
      focusStyle="focus:ring-tblue-100 focus:border-tprimary-100 select-none ring:!shadow-0"
    />
  );
};