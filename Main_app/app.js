import express from "express";
import cors from "cors";
// import pool from "./DB/db.js";
import isPhonetic from "./phonetic_algo/isPhonetic.js";
import isDisallowed from "./Disallowed/isDisallowed.js";
import isExist from "./DB/alreadyExist.js";

const app = express();
const PORT = process.env.PORT || 4000;

//middlwar
app.use(express.json());
app.use(cors());

app.post("/api/submit", async (req, res) => {
    const formdata = req.body; 
    const is_exist = await isExist(formdata.newsTitle);
    console.log(formdata);
    //check if the user's title is already exist or not
    if (is_exist.found == true) {
        res.status(200).json({ message: `${is_exist.message}` });
    } else {
        try {
            // step 1:- First check for disallowed words
            const disallowed = await isDisallowed(formdata.newsTitle);
            if (disallowed.found == true) {
                res.status(200).json({ message: `${disallowed.message}` });
            } else {
                //If there is no any disallowed words in user's title then
                // go for similar sound algo
                const result = await isPhonetic(formdata.newsTitle);
                if (!result.found) {
                    res.status(200).json({
                        message: `${result.message}`,
                    });
                } else {
                    res.status(200).json({
                        message: `${result.message}`,
                    });
                }
            }
        } catch (err) {
            console.log("Error in /api/submit:", err);
            res.status(500).json({ message: "server error" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
