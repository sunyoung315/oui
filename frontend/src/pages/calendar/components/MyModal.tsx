import styled from "styled-components"
import useStore from "../store"
import TodoList from "../todo/TodoList"
import { format } from "date-fns"
import Todo from "../todo"
import { useState } from "react"

const MyModalWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 2%;
  margin-left: 10%;
  overflow: auto;
  background-color: #FFFEFC;
`
const ModalHeaderWrapper = styled.div`
  display: flex;
  margin-left: 1%;
  margin-top: 3%;
  margin-bottom: 2%;
  align-items: flex-end;
`

const PlusButton = styled.button`
  border: 1px solid;
  height: 50px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  padding-top: 10px;
`

const MyModal = (props) => {

  const { schedules, diaryId } = props

  const [ modalContent, setModalContent ] = useState(true);

  const { clickDate } = useStore()

  const createTodo = () =>{
    setModalContent(!modalContent)
  }

  const todos = schedules?.filter(( schedule ) => schedule?.date?.substring(5, 10) === format( clickDate, 'MM-dd'))

  return(
    <MyModalWrapper>
      { modalContent &&
      <>
      <ModalHeaderWrapper>
        <div style={{ fontSize:'30px', marginRight:'20px', marginBottom:'1px'}}>일정</div>
        <div style={{ fontSize:'16px', marginLeft: '2%', marginBottom:'1px' }}> { format( clickDate, 'yyyy-MM-dd' )}</div>
      </ModalHeaderWrapper>
        <PlusButton onClick={ createTodo }>+</PlusButton>
        <TodoList schedules = { todos }/>
      </>
      }{
        !modalContent &&
        <Todo type='개인' diaryId= { diaryId }/>
      }
    </MyModalWrapper>
  )
}

export default MyModal