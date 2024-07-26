import React, { useState } from 'react'
import { Datepicker } from 'flowbite-react'
import { Button } from '../../../components/forms/button'
import { themeOptions } from '../../../utils/calendarTheme'
import { DropDownSelect } from '../../../components/forms/dropdown'
import { useTimeOptions } from '../../../utils/timeOptions'
import { Storage } from '../../../app/storage'
import { toast } from 'sonner'
import moment from 'moment'

export const ScheduleModal = ({ onClose, setPublishDate }) => {

    const options = useTimeOptions();
    const [time, setTime] = useState('8:00')
    const [date, setDate] = useState(new Date());

    const handleTimeSelect = (option) => {
        setTime(option.value)
    }
    const handleDatePicker = (SelectedDate) => {
        setDate(SelectedDate)
    }

    const handleSchedulePost = () => {

      let formattedDate = moment(date).format("YYYY-MM-DD")
      let newTime = moment(time, "hh:mm:ss");
      let formattedTime = moment(newTime._d).format("HH:mm:ss");

      const isCurrentDateOrOlder = moment(formattedDate).isSameOrBefore();
      const currentTime = moment(new Date()).format("HH:mm:ss")

      if(currentTime > formattedTime && isCurrentDateOrOlder){
        return toast.error("You can't select a passed time")
      };

      setPublishDate(() => `${formattedDate} ${formattedTime}`);
      Storage.setItem("post_publish", `${formattedDate} ${formattedTime}`)
      onClose();
    }

    const handleCancelSchedule = () => {
      setPublishDate(() => null)
      onClose();
    }

  return (
    <div className='w-full flex flex-col gap-2'>
      <p className='border-b border-tgray-75 w-full p-3 flex flex-col'>
        <span className='text-xl font-semibold'>Schedule Post</span>
        <span className='text-base text-tgray-150'>West African Standard Time (UTC +1)</span>
      </p>

      <main className='w-full flex items-center justify-center flex-col gap-4 px-3'>
        <section className='w-full flex items-center justify-center'>
            <Datepicker
              inline
              className='w-full'
              theme={themeOptions} 
              minDate={new Date()}
              onSelectedDateChanged={handleDatePicker}
            />
        </section>

        <DropDownSelect
            defaultValue="8:00 AM"
            options={options}
            onChange={handleTimeSelect}
        />
        <p className='text-base text-tgray-100'>Your Post will be sent on 
            <span className='font-semibold text-tblack-100'> {moment(date).format("MMMM Do YYYY")}</span> at
            <span className='font-semibold text-tblack-100'> {time}.</span>
        </p>
      </main>
      <footer className='flex items-center justify-start border-t border-tgray-75 w-full p-3 gap-4'>
        <Button
          variant='primary'
          children='Schedule Post'
          onClick={handleSchedulePost}
        />

        <Button
          variant='link'
          children='Cancel'
          onClick={handleCancelSchedule}
        />
      </footer>
    </div>
  )
}