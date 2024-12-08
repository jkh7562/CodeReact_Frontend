import { atom } from "recoil";
import { getCookie } from "../util/cookieUtil";

const initState = {
    email:'',
    nickname:'',
    social: false,
    accessToken:'',
    refreshToken:''
}

const loadMemberCookie = () => { //쿠키에서 체크

    const memberInfo =  getCookie("member")

    //닉네임 처리
    if(memberInfo && memberInfo.nickname) {
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname)
    }

    return memberInfo
}

const signinState = atom({
    key:'signinState',
    default: loadMemberCookie() || initState
})


export default signinState