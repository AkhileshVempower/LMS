//today date in ddmmyyyy
export const todaysDate=()=>{
    return new Date().toISOString().split("T")[0].split("-").reverse().join("")
}