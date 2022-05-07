const getDateDifference = (date1,date2) => {

            var t2 = date2.getTime();
            var t1 = date1.getTime();
     
            return Math.ceil((t2-t1)/(24*3600*1000)) + 1;
        
}

export default getDateDifference