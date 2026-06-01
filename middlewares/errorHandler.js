export const errorHandle = (err,req,res,next)=>{
    res.status(err.status|| 500).json({
        success:false,
        message:err.message||"server error"
    });
};

export const notFound = (req,res)=>{
    res.status(404).json({
        success:false,
        message:`Route ${req.originalUrl} not found`
});
};