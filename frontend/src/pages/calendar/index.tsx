import { useEffect, useState } from 'react';
import { Drawer } from "src/components/control/Drawer";
import { addDays, addMonths, format, subMonths } from 'date-fns'
import { DateList, DayList, MyModal, ShareModal }  from './components'
import writeDiary from 'src/asset/images/image-icon/write-btn.png'
import { LeftIcon, RightIcon } from 'src/components'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import useStore from './store';
import staticStore from 'src/store'
import { createPortal } from 'react-dom'
import useDate from 'src/util/date'
import { getCalendar, getShareCalendar } from './api';
import { Header } from 'src/components/control/Header';
import { BottomNavi } from 'src/components/control/BottomNavi';
import styled from 'styled-components'

const Title = styled.div`
    font-size: 35px;
    font-weight: 600;
    margin-bottom: 5px;
    padding-top: 15px;
`

const CalendarWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: calc(90% - 100px);
  align-items: center;
  flex-direction: column;
  padding-bottom: 50px; 
`

const CalendarHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin-top: 25px;
`

const CalendarHeaderRightWrapper =styled.button `
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
  background-color: transparent;
`

const CalendarHeaderMiddleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px; 
  margin-top: 10px;
  margin-left: 18%;
  flex: 1;
`

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 400;
`
    
const Modal = styled.div`
  height: 40%;
  width: 100%;
  background-color: #FFFEFC;
  position: fixed;
  bottom: 0;
  box-shadow: 0px -3px 0px 0px rgba(211, 211, 211, 0.2);
  border-radius: 10px 10px 0 0;
`



const Calendar = () =>{

  const navigator = useNavigate()

  const { isModalOpened, updateModal } = useStore() // Day 컴포넌트에서 업데이트 된 상태 가져오기
  const { diaryId, type } = staticStore();


  const { currentMonth, setCurrentMonth, calculateDateRange } = useDate() // 달력 옆 버튼
  const { startDate, endDate } = calculateDateRange()
  
  const html = document.querySelector( 'html' )


  const closeModal = () => { 
      updateModal()
      html?.classList.remove( 'scroll-locked' )
  }


  const ModalPortal = ({ children, onClose  }) => { 
    const handleBackgroundClick = (e) => {
      ( e.target === e.currentTarget ) && onClose()
    }
    return createPortal(
      <ModalBackground onClick={ handleBackgroundClick }>
        <Modal>{ children }</Modal>
      </ModalBackground>,
      document.body
    )
  }

  const goDiaryWrite = () =>{
    navigator(`/diary/write/${diaryId}`)
  }
  

  const days = []
  let day = startDate

  while( day < endDate ){
    days.push( day )
    day = addDays( day, 1 )
  }

  const movePrevMonth = () =>{ setCurrentMonth( subMonths( currentMonth, 1) ) }
  const moveNextMonth = () => { setCurrentMonth( addMonths( currentMonth, 1) ) }

  
  const today = format( currentMonth, 'yyyy-MM-01' ) //월 데이터 전송 고정

  let queryKey = null; // 개인과 공유 키 분리
  let queryParams = null; // 개인과 공유 파람 분리

  if ( type === '개인' ) {
    queryKey = [ 'calendars', currentMonth ]
    queryParams = () => getCalendar( today )
  } else {
    queryKey = [ 'calendars', currentMonth ]
    queryParams = () => getShareCalendar({ date: today, diaryId: diaryId })
  }

  const { data: calendars, refetch } = useQuery<any>( queryKey, queryParams )

  useEffect(() => { refetch() }, [ currentMonth, refetch ])

  return(
    <>
          <Header>
            <span style={{ marginTop: "39px", marginLeft: "8px" }}>
              <Drawer/>
            </span>
            <div/>
            <div/>
          </Header>
          <CalendarWrapper>
            <CalendarHeaderWrapper>
              <CalendarHeaderMiddleWrapper>
                <LeftIcon size= { 31 } onClick={ movePrevMonth }/>
                <Title>{ format( currentMonth, 'yyyy' )}년 { format( currentMonth, 'M' )}월</Title>
                <RightIcon size= { 31 } onClick={ moveNextMonth }/>
              </CalendarHeaderMiddleWrapper>
              <CalendarHeaderRightWrapper onClick={ goDiaryWrite }>
                  <img src={ writeDiary } alt='' style={{ height: '50px'}}/>
              </CalendarHeaderRightWrapper>
            </CalendarHeaderWrapper>
            { 
              isModalOpened && type==='개인' &&
                <ModalPortal onClose={ closeModal }>
                  <Modal>
                    <MyModal schedules= { calendars?.data?.schedules } diaryId= { diaryId }/>
                  </Modal>
                </ModalPortal>
            }
            { 
              isModalOpened && type==='공유' &&
                <ModalPortal onClose={ closeModal }>
                  <Modal>
                    <ShareModal diaries= { calendars?.data?.members }
                                diaryId = { diaryId } members= { calendars?.data?.members } />
                  </Modal>
                </ModalPortal>
            }
            <DateList/>
            <DayList list = { days } calendars = { calendars?.data } type = { type }/>
            </CalendarWrapper>
            <BottomNavi/>
          </>
  )
}

export default Calendar