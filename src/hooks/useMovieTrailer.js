import { useEffect } from "react";
import { useDispatch } from "react-redux"; 
import { addTraierVideo } from "../utils/moviesSlice";
import { API_OPTIONS } from "../utils/constants";

const useMovieTrailer = (movie_id)=>{
    const dispatch = useDispatch();
    const getMovieVideos = async () => {
    const data = await fetch(
        "https://api.themoviedb.org/3/movie/"+ movie_id +"/videos?language=en-US",
        API_OPTIONS
    );
    const json = await data.json();

    const filterData = json.results.filter((video) => video.type === "Trailer");
    const trailer = filterData.length ? filterData[0] : json.results[0];
    dispatch(addTraierVideo(trailer));
    };

    useEffect(() => {
    getMovieVideos();
    }, []);
};

export default useMovieTrailer;