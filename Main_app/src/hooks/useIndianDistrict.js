import { useState, useEffect } from "react"

function useIndianDistrict(state) {
    const [data, setData] = useState([])

    useEffect(() => {

        const fetchDistrict = async () => {

            await fetch("https://raw.githubusercontent.com/pranshumaheshwari/indian-cities-and-villages/master/data.json")
                .then(async (res) => await res.json())
                .then((res) => res.filter((item) => item.state === state))

                .then((res) => res[0].districts)   //! from json file 

                .then((res) => {
                    const a = res.map((i) => i.district);
                    return a
                })
                .then((res) => setData(res))
                // .catch((rej) => )
        }

        if (state) {
            fetchDistrict();
        }
    }, [state])

    return data
}

export default useIndianDistrict
