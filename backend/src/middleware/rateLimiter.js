import ratelimit from "../config/upstash.js"

const rateLimiter = async (req, res,next) => {
    try{
        const clientIp = req.ip || req.headers["x-forwarded-for"] || "anonymous-global";
        
        const { success } = await ratelimit.limit(`limit-${clientIp}`);
    
        if(!success){
            return res.status(429).json({message: "Too many requests, please try again later"})
        }
        next()
    } catch(error){
        console.log("Rate limit error", error)
        next();

    }

}

export default rateLimiter