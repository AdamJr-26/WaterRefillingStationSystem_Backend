const axios = require("axios");
const getDateTimeByWTI = async (timezone) => {
  //  fetch
  const res = await axios.get(
    `http://worldtimeapi.org/api/timezone/${timezone}`
  );
  //   if(res.data)
  const data = res.data;
  if(data && !res.error){
    return { data };
  }else{
    false
  }
};
module.exports = getDateTimeByWTI;
