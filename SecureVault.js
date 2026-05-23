// ==========================================
// 1. CHECK PASSWORD FUNCTION
// ==========================================

function checkPassword(password) {

    // Rule 1 - Check uppercase letters
    let hasUpper = /[A-Z]/.test(password)

    // Rule 2 - Check lowercase letters
    let hasLower = /[a-z]/.test(password)

    // Rule 3 - Check numbers
    let hasNumber = /[0-9]/.test(password)

    // Rule 4 - Check special characters
    let hasSpecial = /[!@#$%^&*]/.test(password)

    // Rule 5 - Check password length
    let isLong = password.length >= 8

    // Calculate score
    let score = 0

    if (hasUpper) {
        score++
    }

    if (hasLower) {
        score++
    }

    if (hasNumber) {
        score++
    }

    if (hasSpecial) {
        score++
    }

    if (isLong) {
        score++
    }

    // Return results
    return {

        score: score,

        hasUpper: hasUpper,
        hasLower: hasLower,
        hasNumber: hasNumber,
        hasSpecial: hasSpecial,
        isLong: isLong
    }
}


// ==========================================
// 2. UPDATE STRENGTH BAR FUNCTION
// ==========================================

function updateStrengthBar(result) {

    let bar = document.getElementById("strengthBar")

    let label = document.getElementById("strengthText")

    // Very Weak
    if (result.score <= 1) {

        bar.style.width = "20%"
        bar.style.background = "#ff4444"

        label.innerText = "Very Weak"
    }

    // Weak
    else if (result.score === 2) {

        bar.style.width = "40%"
        bar.style.background = "#ff8844"

        label.innerText = "Weak"
    }

    // Medium
    else if (result.score === 3) {

        bar.style.width = "60%"
        bar.style.background = "#ffaa00"

        label.innerText = "Medium"
    }

    // Strong
    else if (result.score === 4) {

        bar.style.width = "80%"
        bar.style.background = "#00cc66"

        label.innerText = "Strong"
    }

    // Very Strong
    else if (result.score === 5) {

        bar.style.width = "100%"
        bar.style.background = "#00ff88"

        label.innerText = "Very Strong"
    }
}


// ==========================================
// 3. UPDATE FEEDBACK FUNCTION
// ==========================================

function updateFeedback(result) {

    let weaknesses = []

    // Check rules

    if (!result.hasUpper) {

        weaknesses.push(
            "❌ Add uppercase letters (A-Z)"
        )
    }

    if (!result.hasLower) {

        weaknesses.push(
            "❌ Add lowercase letters (a-z)"
        )
    }

    if (!result.hasNumber) {

        weaknesses.push(
            "❌ Add numbers (0-9)"
        )
    }

    if (!result.hasSpecial) {

        weaknesses.push(
            "❌ Add special characters (!@#$)"
        )
    }

    if (!result.isLong) {

        weaknesses.push(
            "❌ Make it at least 8 characters"
        )
    }

    // Show feedback
    let feedback =
        document.getElementById("weaknessFeedback")

    // No weaknesses
    if (weaknesses.length === 0) {

        feedback.innerText =
            "✅ Strong password! No weaknesses found."
    }

    // Show weaknesses
    else {

        feedback.innerText =
            weaknesses.join("\n")
    }
}


// ==========================================
// 4. CRACK TIME ESTIMATOR
// ==========================================

function estimateCrackTime(password) {

    // Character pool size
    let poolSize = 0

    if (/[a-z]/.test(password)) {
        poolSize += 26
    }

    if (/[A-Z]/.test(password)) {
        poolSize += 26
    }

    if (/[0-9]/.test(password)) {
        poolSize += 10
    }

    if (/[!@#$%^&*]/.test(password)) {
        poolSize += 32
    }

    // Total combinations
    let combinations =
        Math.pow(poolSize, password.length)

    // 10 billion guesses/sec
    let seconds =
        combinations / 10_000_000_000

    // Human-readable format
    if (seconds < 1) {

        return "⚡ Less than 1 second — INSTANT CRACK!"
    }

    else if (seconds < 60) {

        return `⏱️ About ${Math.round(seconds)} seconds`
    }

    else if (seconds < 3600) {

        return `⏱️ About ${Math.round(seconds / 60)} minutes`
    }

    else if (seconds < 86400) {

        return `⏱️ About ${Math.round(seconds / 3600)} hours`
    }

    else if (seconds < 31536000) {

        return `⏱️ About ${Math.round(seconds / 86400)} days`
    }

    else if (seconds < 3153600000) {

        return `✅ About ${Math.round(seconds / 31536000)} years`
    }

    return "🔒 Centuries — Extremely Strong!"
}


// ==========================================
// 5. ATTACK METHOD FUNCTION
// ==========================================

function getAttackMethod(result) {

    if (result.score <= 1) {

        return (
            "🎯 Attack: Dictionary Attack — " +
            "Common words cracked in seconds"
        )
    }

    else if (result.score <= 2) {

        return (
            "🎯 Attack: Brute Force — " +
            "Simple combinations cracked quickly"
        )
    }

    else if (result.score <= 3) {

        return (
            "🎯 Attack: Hybrid Attack — " +
            "Combination of dictionary + brute force"
        )
    }

    else if (result.score <= 4) {

        return (
            "🎯 Attack: Advanced Brute Force — " +
            "Would take significant time"
        )
    }

    return (
        "✅ Extremely Resistant — " +
        "No practical attack method works"
    )
}


// ==========================================
// 6. TOGGLE PASSWORD VISIBILITY
// ==========================================

let input =
    document.getElementById("passwordInput")

let toggleBtn =
    document.getElementById("togglePassword")

toggleBtn.addEventListener("click", function () {

    // Show password
    if (input.type === "password") {

        input.type = "text"

        toggleBtn.innerText = "🙈"
    }

    // Hide password
    else {

        input.type = "password"

        toggleBtn.innerText = "👁"
    }
})


// ==========================================
// 7. EVENT LISTENER
// ==========================================

input.addEventListener("input", function () {

    // Read password
    let password = input.value

    // Analyze password
    let result = checkPassword(password)

    // Update strength bar
    updateStrengthBar(result)

    // Update weakness feedback
    updateFeedback(result)

    // Update crack time
    document.getElementById("crackTime").innerText =
        estimateCrackTime(password)

    // Update attack method
    document.getElementById("attackMethod").innerText =
        getAttackMethod(result)
})


// ==========================================
// 8. SHA-256 HASH FUNCTION
// ==========================================

async function sha256(text) {

    // Convert text to bytes
    let encoder = new TextEncoder()
    let data = encoder.encode(text)

    // Use browser's built-in crypto
    let hashBuffer = await crypto.subtle.digest("SHA-256", data)

    // Convert result to readable hex string
    let hashArray = Array.from(new Uint8Array(hashBuffer))
    let hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")

    return hashHex
}


// ==========================================
// 9. ENCRYPT BUTTON HANDLER
// ==========================================

let encryptBtn = document.getElementById("encryptBtn")

encryptBtn.addEventListener("click", async function() {

    // Get the password from input
    let password = input.value

    // Check if input is empty
    if (password === "") {
        document.getElementById("encryptionOutput").innerText =
            "⚠️ Please enter a password first!"
        return
    }

    // Get selected method from dropdown
    let method = document.getElementById("encryptionMethod").value

    let output = ""

    if (method === "AILA") {
        let derived = await AILA(password)
        output = derived                    // ← Clean! No extra text

    } else if (method === "sha256") {
        output = await sha256(password)

    } else if (method === "base64") {
        output = btoa(password)

    } else if (method === "md5") {
        output = "⚠️ MD5 is insecure! Use SHA-256 instead."
    } 
    // Show result
    document.getElementById("encryptionOutput").innerText = output
})


// ==========================================
// 10. COPY BUTTON
// ==========================================

let copyBtn = document.getElementById("copyBtn")

copyBtn.addEventListener("click", function() {

    let outputText = 
        document.getElementById("encryptionOutput").innerText

    // Check if there is something to copy
    if (outputText === "" || outputText === undefined) {
        alert("Nothing to copy yet!")
        return
    }

    // Copy to clipboard
    navigator.clipboard.writeText(outputText)

    // Give user feedback
    copyBtn.innerText = "✅ Copied!"

    // Reset button text after 2 seconds
    setTimeout(function() {
        copyBtn.innerText = "📋 Copy"
    }, 2000)
})

// ==========================================
// 10. AILA PASSWORD FUNCTION
// ==========================================

async function AILA(input) { 

    // Get SHA-256 hash of input
    let hash = await sha256(input)

    // Character sets
    let upper   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let lower   = "abcdefghijklmnopqrstuvwxyz"
    let numbers = "0123456789"
    let special = "!@#$%^&*"

    let derived = ""
    let pos = 0

    // 4 rounds × 4 chars = 16 chars total
    for (let round = 0; round < 4; round++) {

        let h1 = parseInt(hash.substring(pos, pos+2), 16)
        derived += upper[h1 % upper.length]
        pos += 2

        let h2 = parseInt(hash.substring(pos, pos+2), 16)
        derived += lower[h2 % lower.length]
        pos += 2

        let h3 = parseInt(hash.substring(pos, pos+2), 16)
        derived += numbers[h3 % numbers.length]
        pos += 2

        let h4 = parseInt(hash.substring(pos, pos+2), 16)
        derived += special[h4 % special.length]
        pos += 2
    }

    return derived
}

