import { DropDownSelect } from "../../../../components/forms/dropdown"
import { TextRadioButton } from "../../../../components/forms/textradiobutton"
import { CustomDoubleRangeSlider } from "../../../../components/global/customdoublerange"

export const SlideOne = ({ minAge, maxAge, gender, country, countries, loadingCountries, handleSelectCountry, handleCountrySearch, countrySearch, rangeValueChange, handleGender }) => {
    return (
        <div className="flex flex-col gap-6 divide-y divide-tgray-50">
            <DropDownSelect
                label="Location"
                defaultValue={country?.name ?? "country"}
                options={countries?.data}
                isLoading={loadingCountries}
                onChange={handleSelectCountry}
                search
                searchChange={handleCountrySearch}
                searchValue={countrySearch}
            />

            <section className="flex flex-col gap-12 py-6">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Customize who you want to reach.</p>
                    <span className="text-[10px] font-medium text-[#858585]">Select age range</span>
                </div>


                <CustomDoubleRangeSlider
                    initialMin={minAge}
                    initialMax={maxAge}
                    min={0}
                    max={60}
                    step={5}
                    onValueChange={rangeValueChange}
                />
            </section>

            <section className="flex flex-col w-full py-6 gap-6">
                <span className="text-[10px] font-medium text-[#858585]">Select gender</span>

                <section>
                    <section className="w-full flex flex-row flex-wrap gap-6">
                        <TextRadioButton
                            label="Male"
                            name="gender"
                            onChange={handleGender}
                            value="Male"
                            checked={gender === "Male"}
                        />
                        <TextRadioButton
                            label="Female"
                            name="gender"
                            onChange={handleGender}
                            value="Female"
                            checked={gender === "Female"}
                        />
                        <TextRadioButton
                            label="Choose not to specify"
                            name="gender"
                            onChange={handleGender}
                            value={"null"}
                            checked={gender === "null"}
                        />
                        <TextRadioButton
                            label="Others"
                            name="gender"
                            onChange={handleGender}
                            value="Others"
                            checked={gender === "Others"}
                        />
                    </section>
                </section>
            </section>
        </div>
    )
}