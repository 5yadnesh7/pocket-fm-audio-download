import React, { useEffect, useState } from "react";
import Styles from "@/styles/PocketFm.module.css"
import Axios from "axios";

const PocketFm = () => {
    // const showId = "a83e59e9fef308021cecde68d7543c792a130856";
    // const showId = "f629196ee7df34287ef2672e91fda9f939e9d02d";
    // const showId = "c5914522a628b6d13a06d520270d6a6f6926cc2e";
    // const showId = "cf52aa52cc0afb75ba6f8ee6e25b52986e5098d1";
    const [page, setPage] = useState(0);
    const [allData, setAllData] = useState([]);
    const [storyDetails, setStoryDetails] = useState({ title: "", total: 0, img: "", showId: "" })
    const [loader, setloader] = useState(false)
    const [isDataFound, setIsDataFound] = useState(false)
    const [isSearch, setIsSearch] = useState(false)

    useEffect(() => {
        if (storyDetails.showId && isSearch) {
            if (!loader) {
                setloader(true)
            }
            Axios.post("/api/storyList", { showId: storyDetails.showId, page }).then(rsp => {
                const res = rsp.data?.res;
                if (res) {
                    setIsDataFound(true)
                    setStoryDetails({ ...storyDetails, title: res?.show_title, total: res?.tab_count, img: res?.image_url })
                    const data = res.stories.map((item) => {
                        return { story_title: item.story_title, media_url: item.media_url };
                    });
                    const tmpAry = [];
                    data.map((item) => {
                        if (!allData?.find((cur) => cur.story_title === item.story_title)) {
                            tmpAry.push(item);
                        }
                    });
                    if (tmpAry.length > 0) {
                        setAllData([...allData, ...tmpAry]);
                    }
                } else {
                    setIsDataFound(false)
                }
            });
        }
    }, [page, storyDetails.showId, isSearch]);

    useEffect(() => {
        if (allData?.length > 0) {
            if (allData?.length <= storyDetails.total) {
                setPage((prv) => prv + 10);
            }
        }
        if (allData?.length === storyDetails.total && storyDetails.total !== 0) {
            setloader(false)
            // console.log("checking at line ", allData, " diff ", allData?.length, storyDetails.total);
        }
    }, [allData]);

    const resetData = () => {
        setPage(0);
        setAllData([]);
        setStoryDetails({ title: "", total: 0, img: "", showId: "" })
        setIsDataFound(false)
        setIsSearch(false)
    }

    const downloadFile = async (url, fileName) => {

        // const response = await fetch(url);
        // const fileBuffer = await response?.blob();
        // console.log("checking at line 73 ", fileBuffer)
        // response.blob().then(blob => {
        //     const blobUrl = URL.createObjectURL(blob);

        //     // Create an anchor element with download attribute to initiate download
        //     const a = document.createElement('a');
        //     a.href = blobUrl;
        //     a.download = fileName;
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a);

        //     // Revoke the blob URL to free up memory
        //     URL.revokeObjectURL(blobUrl);
        // });

        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `${fileName}.mp3`);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    }

    return (
        <div className={`${Styles.pageContainer}`}>
            {
                allData?.length > 0 && isDataFound ?
                    <div className={`${Styles.displayData}`}>
                        <button onClick={resetData} className={`${Styles.btn}`}>Search Other</button>
                        <img src={storyDetails.img} alt={storyDetails.title} width={300} height={300} />
                        <h1>Title is {storyDetails.title}</h1>
                        <h2>Total Episode is {storyDetails.total}</h2>
                        <div className={`${Styles.displayTb}`}>
                            {
                                allData?.length > 0 && allData.map(item => {
                                    return (
                                        <a key={item.story_title} href={item.media_url} download={item.story_title}>
                                            <button className={`${Styles.btn}`}>{item.story_title}</button>
                                            {/* <button className={`${Styles.btn}`} onClick={() => downloadFile(item.media_url, item.story_title)}>{item.story_title}</button> */}
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <div className={`${Styles.inputContainer}`}>
                        Enter audio id :- <input type="text" value={storyDetails.showId} onChange={(e) => setStoryDetails({ ...storyDetails, showId: e.target.value })} />
                        <button onClick={() => setIsSearch(true)} className={`${Styles.btn}`}>Search</button>
                        {
                            isSearch && !isDataFound && loader && "Sorry no data found"
                        }
                    </div>
            }
        </div>
    );
}

export default PocketFm