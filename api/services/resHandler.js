module.exports = (function () {

    function returnResponse(data, code, res) {
      var respObj = {};
      respObj.resp = {};
      respObj.resp.data = data;
      respObj.resp.code = code;
      //respObj.resp.error = err ? err : new LFApiError("", "");
      return res.json(respObj);
    }
  
    function returnResponsev1(data, code, res, error, message) {
      var respObj = {};
      respObj.resp = {};
      respObj.resp.data = data || {};
      respObj.resp.data.error = error;
      respObj.resp.code = code;
      if (error) {
        respObj.resp.msg = error.errorMessage;
      }
      if(message){
        respObj.resp.msg = message;
      }
      //removed status from res as react app expects differently
      //return res.status(code).json(respObj);
      return res.json(respObj);
    }
  
    function returnErrorResponse(res,error, code, message){
      var respObj = {};
      respObj.resp = {};
      respObj.resp.error = error;
      respObj.resp.code = code;
      if(message){
        respObj.resp.msg = error.errorMessage;
      } else if (error ) {
        respObj.resp.msg = error.errorMessage;
      }
      return res.json(respObj);
    }
  
    function LFApiError(errCode, errMsg, errDetail) {
      var errorObj = {};
      this.code = errCode;
      this.errorMessage = errMsg ? errMsg : "";
      this.errDetail = errDetail ? errDetail : "";
      this.isError = true;
      //return errorObj;
    }
  
    return {
      returnResponse: returnResponse,
      LFApiError: LFApiError,
      returnResponsev1: returnResponsev1,
      returnErrorResponse
    };
  })();
  