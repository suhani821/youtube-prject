//to not write code of try and catch again and again in different files so we make this wrapper


const asyncHandler = (requestHandler)=> {
  return  (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err));
    }
}
export default asyncHandler;