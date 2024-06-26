import { Drawer } from "src/components/control/Drawer";
import { Button } from "src/components/control/Button";
import { Header } from "src/components/control/Header";
import { format } from 'date-fns'
import { getWeekly, getMember } from "./api/";
import { useQuery } from 'react-query'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Switch } from "./components/Switch";
import { BottomNavi } from "src/components/control/BottomNavi";
import useStore from 'src/store'
import useDate from 'src/util/date'
import Monthly from "./components/Monthly/Monthly";
import styled from 'styled-components';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
);


const SwitchWrapper = styled(Switch)`
    display: flex;
    margin-left: auto;
    width: 100%;
    justify-content: center;
    .TitleWrapper{
        align-items: flex-start;
    }
`;

const BoxWrapper = styled.div`
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    padding: 5px 5px 120px 5px;
    justify-content: center;
    align-items: center;
    overflow: hidden; 
`;


const GraphWrapper = styled.div`
    width: 89%;
    height: 30vh;
    margin: auto; 

    display: flex; 
    justify-content: center; 
    align-items: center; 
    margin-bottom: 3%;
    margin-top: 3%;
`;





const Analysis = () => {

    const [ keyType, setKeyType ] = useState( 1 ); 
    const [ happyDataSet, setHappyDataSet ] = useState( {
        labels: [],
        datasets: [],
    } );
    const [ sadDataSet, setSadDataSet ] = useState( {
        labels: [],
        datasets: [],
    } ); 
    const [ userName, setUserName ] = useState('')
    const { currentMonth } = useDate() 
    const { diaryId } = useStore()
    const today = format(currentMonth, 'yyyy-MM-dd')
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];


    //api
    const { data: memberData, refetch: refetchMember } = useQuery(['memberData'], getMember, {
        onSuccess: ( res ) => {
          setUserName( res.data.nickName );
          console.log( res.data );
        }
      });



    useEffect(()=>{
        getWeekly({ diaryId: diaryId, date: today }).then(( res )=>{
            const tempDayLabel = [];
            const tempHappyData = [];
            const tempSadData = [];

            //데이터가 있을 때
            if(res !== undefined ){
                Object.keys(res.data).sort().forEach((key,value)=>{
                    tempHappyData.push( res.data[key][0] )
                    tempSadData.push( res.data[key][1] )
                    // console.log( res.data[key][1] )
                    const temp = new Date(key)
                    tempDayLabel.push(daysOfWeek[temp.getDay()])
                })
            }



            setHappyDataSet({
                labels: tempDayLabel,
                datasets: [{
                    data: tempHappyData,
                    fill: true,
                    backgroundColor: "#FFFEFC",
                    borderColor: "#FFDD6B",
                    pointBackgroundColor: "#FFDD6B",
                    pointBorderWidth: 2,
                    pointBorderColor: "#FFC814",
                }]
              });
      
              setSadDataSet({
                labels: tempDayLabel,
                datasets: [{
                    data: tempSadData,
                    fill: true,
                    backgroundColor: "#FFFEFC",
                    borderColor: "#C0DEFF",
                    pointBackgroundColor: "#C0DEFF",
                    pointBorderWidth: 2,
                    pointBorderColor: "#88B3E2",
                }]
              });
        }).catch(( err ) => {
            console.log( err )
        })
        getMember();

    },[]);


    const options = {
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 18,
                        family: 'JGaegujaengyi',
                    },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                border: {
                    dash: [8,4],
                },  
            },
            y: {
                ticks: {
                    font: {
                        size: 18,
                        family: 'JGaegujaengyi',
                    },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                border: {
                    dash: [8,4],
                },  
            }
        }
    };
    return(
        <>
                <Header>
                    <span style={{ marginTop: "39px", marginLeft: "8px" }}>
                        <Drawer />
                    </span>
                    <Button></Button>
                    <Button></Button>
                </Header>
                <div>
                    <SwitchWrapper setKeyType={ setKeyType } keyType={ keyType } ></SwitchWrapper>
                    <BoxWrapper>
                    {keyType === 2 && (
                        <>
                            <div style={{ marginTop:'5%', marginBottom:'1.5%', fontSize: '28px', width:'85%', display:"flex"}}>
                            <p style={{whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden' ,width:'16%', paddingRight:'0.8%', marginTop:'-1.2%'}}> { userName } </p>님의 이번 주  <p style={{fontWeight:'bold', marginLeft: '1.5%' , marginRight:'1.5%'}}> “행복 그래프”</p> 예요!
                            </div>
                            <div style={{ padding:'20px', width: '85%', borderRadius:'15px', backgroundColor:'#FFFEFC' }}>
                                <GraphWrapper>
                                    <Line data={ happyDataSet } options={ options } />
                                </GraphWrapper>
                                
                            </div>
                            <div style={{ marginTop:'10%', marginBottom:'1.5%', fontSize: '28px', width:'85%', display:"flex"}}>
                            <p style={{whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden' ,width:'16%', paddingRight:'0.8%', marginTop:'-1.2%'}}> { userName } </p>님의 이번 주 <p style={{fontWeight:'bold', marginLeft: '1.5%' , marginRight:'1.5%'}}>“우울 그래프”</p> 예요!
                                </div>
                            <div style={{ padding:'20px', width: '85%', borderRadius:'15px', backgroundColor:'#FFFEFC' }}>
                                <GraphWrapper>
                                    <Line data={ sadDataSet }  options={ options }/>
                                </GraphWrapper>
                            </div>

                        </>
                    )}
                    {keyType === 1 && (
                        <>
                            <Monthly></Monthly>
                        </>
                    )}
                    </BoxWrapper>
                </div>
                <BottomNavi/>
                
        </>
    );

}

export default Analysis;