export const getorcreateUser = () => {
    let userid = localStorage.getItem('wosid')
    if (!userid){
        userid = crypto.randomUUID();
        localStorage.setItem('wosid', userid)
    }
    return userid;
}