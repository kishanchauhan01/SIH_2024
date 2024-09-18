import { useState, useEffect } from "react";

import React from 'react'

function useIndianStates() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchStates = async () => {

            await fetch("https://raw.githubusercontent.com/pranshumaheshwari/indian-cities-and-villages/master/data.json")
                // fetch("C:/Users/dhola/Downloads/main_app  state api/src/Json/data.json") //! give error not allowed to fetch local resources
                .then(async (res) => await res.json())
                // .then((res) => console.log(res))
                .then((res) => {
                    const state = res.map((item) => item.state)
                    return state
                })
                // .then((stateData) => {
                //   console.log(stateData);                // Logs the array of states
                //   console.log(typeof stateData);         // Will log "object" because arrays are objects
                //   console.log(Array.isArray(stateData)); // Will log true if it's really an array
                //   setData(stateData);
                // })
                .then((res) => setData(res))
        }

        fetchStates();
    }, [])

    return data;
}

export default useIndianStates
