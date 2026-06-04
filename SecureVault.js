function checkPassword(password) {

    let hasUpper=/[A-Z]/.test(password)
    let hasLower=/[a-z]/.test(password)
    let hasNumber=/[0-9]/.test(password)
    let hasSpecial=/[!@#$%^&*]/.test(password)
    let isLong=password.length>=8

    let score=0

    if(hasUpper){
        score++
    }

    if(hasLower){
        score++
    }

    if(hasNumber){
        score++
    }

    if(hasSpecial){
        score++
    }

    if(isLong){
        score++
    }

    return{
        score:score,
        hasUpper:hasUpper,
        hasLower:hasLower,
        hasNumber:hasNumber,
        hasSpecial:hasSpecial,
        isLong:isLong
    }
}

function updateStrengthBar(result){

    let bar=document.getElementById("strengthBar")
    let label=document.getElementById("strengthText")

    // Very Weak
    if(result.score<=1){

        bar.style.width="20%"
        bar.style.background="#ff4444"

        label.innerText="Very Weak"
    }

    else if(result.score===2){

        bar.style.width="40%"
        bar.style.background="#ff8844"

        label.innerText="Weak"
    }

    else if(result.score===3){

        bar.style.width="60%"
        bar.style.background="#ffaa00"

        label.innerText="Medium"
    }

    else if(result.score===4){

        bar.style.width="80%"
        bar.style.background="#00cc66"

        label.innerText="Strong"
    }

    else if(result.score===5){

        bar.style.width="100%"
        bar.style.background="#00ff88"

        label.innerText="Very Strong"
    }
}

function updateFeedback(result){

    let weaknesses=[]

    if(!result.hasUpper){

        weaknesses.push(
            " Add uppercase letters (A-Z)"
        )
    }

    if(!result.hasLower){

        weaknesses.push(
            " Add lowercase letters (a-z)"
        )
    }

    if(!result.hasNumber){

        weaknesses.push(
            " Add numbers (0-9)"
        )
    }

    if(!result.hasSpecial){

        weaknesses.push(
            " Add special characters (!@#$)"
        )
    }

    if(!result.isLong){

        weaknesses.push(
            " Make it at least 8 characters"
        )
    }

    let feedback=
        document.getElementById("weaknessFeedback")

    if(weaknesses.length===0){

        feedback.innerText=
            " Strong password! No weaknesses found."
    }

    else{

        feedback.innerText=
            weaknesses.join("\n")
    }
}

// Crack Time
function estimateCrackTime(password){

    let poolSize=0

    if(/[a-z]/.test(password)){
        poolSize+=26
    }

    if(/[A-Z]/.test(password)){
        poolSize+=26
    }

    if(/[0-9]/.test(password)){
        poolSize+=10
    }

    if(/[!@#$%^&*]/.test(password)){
        poolSize+=32
    }

    let combinations=
        Math.pow(poolSize,password.length)

    let seconds=
        combinations/10_000_000_000

    if(seconds<1){

        return" Less than 1 second — INSTANT CRACK!"
    }

    else if(seconds<60){

        return` About ${Math.round(seconds)} seconds`
    }

    else if(seconds<3600){

        return` About ${Math.round(seconds/60)} minutes`
    }

    else if(seconds<86400){

        return` About ${Math.round(seconds/3600)} hours`
    }

    else if(seconds<31536000){

        return` About ${Math.round(seconds/86400)} days`
    }

    else if(seconds<3153600000){

        return` About ${Math.round(seconds/31536000)} years`
    }

    return" Centuries — Extremely Strong!"
}

function getAttackMethod(result){

    if(result.score<=1){

        return(
            " Attack: Dictionary Attack — "+
            "Common words cracked in seconds"
        )
    }

    else if(result.score<=2){

        return(
            " Attack: Brute Force — "+
            "Simple combinations cracked quickly"
        )
    }

    else if(result.score<=3){

        return(
            " Attack: Hybrid Attack — "+
            "Combination of dictionary + brute force"
        )
    }

    else if(result.score<=4){

        return(
            " Attack: Advanced Brute Force — "+
            "Would take significant time"
        )
    }

    return(
        " Extremely Resistant — "+
        "No practical attack method works"
    )
}

// Toggle Password
let input=
    document.getElementById("passwordInput")

let toggleBtn=
    document.getElementById("togglePassword")

toggleBtn.addEventListener("click",function(){

    if(input.type==="password"){

        input.type="text"
        toggleBtn.innerText="X"
    }

    else{

        input.type="password"
        toggleBtn.innerText="@"
    }
})

// Main Event
input.addEventListener("input",function(){

    let password=input.value

    let result=
        checkPassword(password)

    updateStrengthBar(result)

    updateFeedback(result)

    document.getElementById("crackTime").innerText=
        estimateCrackTime(password)

    document.getElementById("attackMethod").innerText=
        getAttackMethod(result)
})

// SHA-256
async function sha256(text){

    let encoder=
        new TextEncoder()

    let data=
        encoder.encode(text)

    let hashBuffer=
        await crypto.subtle.digest(
            "SHA-256",
            data
        )

    let hashArray=
        Array.from(
            new Uint8Array(hashBuffer)
        )

    let hashHex=
        hashArray
        .map(
            b=>b.toString(16).padStart(2,"0")
        )
        .join("")

    return hashHex
}


let encryptBtn=
    document.getElementById("encryptBtn")

encryptBtn.addEventListener("click",async function(){

    let password=input.value

    if(password===""){

        document.getElementById(
            "encryptionOutput"
        ).innerText=
        "Please enter a password first!"

        return
    }

    let method=
        document.getElementById(
            "encryptionMethod"
        ).value

    let output=""

    if(method==="AILA"){

        let derived=
            await AILA(password)

        output=derived
    }

    else if(method==="sha256"){

        output=
            await sha256(password)
    }

    else if(method==="base64"){

        output=btoa(password)
    }

    else if(method==="md5"){

        output=
        "MD5 is insecure! Use SHA-256 instead."
    }

    document.getElementById(
        "encryptionOutput"
    ).innerText=output
})


let copyBtn=
    document.getElementById("copyBtn")

copyBtn.addEventListener("click",function(){

    let outputText=
        document.getElementById(
            "encryptionOutput"
        ).innerText

    if(outputText===""){

        alert("Nothing to copy!")
        return
    }

    navigator.clipboard.writeText(outputText)

    copyBtn.innerText="Copied!"

    setTimeout(function(){

        copyBtn.innerText="Copy"

    },2000)
})
//AILA's logic
async function AILA(input){

    let hash=
        await sha256(input)

    let upper=
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    let lower=
        "abcdefghijklmnopqrstuvwxyz"

    let numbers=
        "0123456789"

    let special=
        "!@#$%^&*"

    let derived=""
    let pos=0

    for(let round=0;round<4;round++){

        let h1=
            parseInt(
                hash.substring(pos,pos+2),
                16
            )

        derived+=
            upper[h1%upper.length]

        pos+=2

        let h2=
            parseInt(
                hash.substring(pos,pos+2),
                16
            )

        derived+=
            lower[h2%lower.length]

        pos+=2

        let h3=
            parseInt(
                hash.substring(pos,pos+2),
                16
            )

        derived+=
            numbers[h3%numbers.length]

        pos+=2

        let h4=
            parseInt(
                hash.substring(pos,pos+2),
                16
            )

        derived+=
            special[h4%special.length]

        pos+=2
    }

    return derived
}
