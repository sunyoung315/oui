import { getAxios } from "src/api/util"

export const getCalendar = async ( params: Date ) => {
    try{
        return await getAxios( '/calendar/my', params )
    }catch( err ){
        console.log( err )
    }
}
