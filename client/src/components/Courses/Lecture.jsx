import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API from "@/services/api";
import Loading from "@/components/loading/loading"
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import s from "../../Styles/Lecture.module.css"
import { useRef } from "react";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cId = params.id || localStorage.getItem('courseId');

  const ref = useRef(null);

  useEffect(() => {
    if (user?.role !== "teacher" && !user?.subscription.includes(cId)) {
      navigate("/");
    } else {
      fetchLectures();
      fetchProgress();
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    // if lecture already completed, don't add event listener
    if (progress?.completedLectures?.includes(lecture._id)) return;
    // on video end make an api call to update progress
    ref.current.addEventListener('ended', async () => {
      try {
         await API.post(`/user/progress`, {
          lectureId: lecture._id,
          courseId: cId,
         }, {
          headers: { token: localStorage.getItem("token") },
        });
        fetchProgress();
      } catch (error) {
        console.error(error);
      }
    }
    );
  }, [lecture]);

  async function fetchLectures() {
    try {
      const { data } = await API.get(`/lectures/${cId}`, {
        headers: { token: localStorage.getItem("token") },
      });

      setLectures(data.lectures);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await API.get(`/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLecture(data.lecture);
    } catch (error) {
      console.error(error);
    } finally {
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!video) {
      toast.error("Please upload a video");
      setBtnLoading(false);
      return;
    }

    try {
      // Create FormData and append all fields
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", video);

      // Send the form data directly to your backend
      const { data } = await API.post(
        `/course/${cId}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);

      // Reset form and hide modal
      setShow(false);
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPrev("");
      fetchLectures();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture?")) {
      try {
        const { data } = await API.delete(`/lecture/${id}`, {
          headers: { token: localStorage.getItem("token") },
        });
        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  async function fetchProgress() {
    try {
      const { data } = await API.get(`/user/progress`, {
        headers: { token: localStorage.getItem("token") },
        params: { course: cId },
      });
      setProgress(data.courseProgressPercentage);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className={s.background}>
      <div className={s.container}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Card className={s.card}>
              <CardHeader className={s.cardHeader}>
                <CardTitle className={s.cardTitle}>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className={s.cardContent}>
                <div className={s.progress}>
                  <div className={s.progressValue} style={{ width: `${progress}%` }} />
                </div>
                <p className="text-right">{progress}%</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {lecLoading ? (
                  <Loading />
                ) : (
                  <Card className={s.card}>
                    <CardContent className={s.cardContent}>
                      {lecture?.video ? (
                        <video

                          ref={ref}
                          src={lecture.video}
                          className={s.video}
                          controls
                        ></video>
                      ) : (
                        <div className="p-6 text-center">
                          Select a lecture to view
                        </div>
                      )}
                    </CardContent>
                    <CardHeader className={s.cardHeader}>
                      <CardTitle className={s.cardTitle}>{lecture?.title}</CardTitle>
                    </CardHeader>
                  </Card>
                )}
              </div>

              <div>
                <Card className={s.card}>
                  <CardHeader className={s.cardHeader}>
                    <CardTitle className={s.cardTitle}>Lecture List</CardTitle>
                  </CardHeader>
                  <CardContent className={s.cardContent}>
                    {user?.role === "teacher" && (
                      <Button
                        onClick={() => setShow(!show)}
                        className={s.button}
                      >
                        {show ? "Close" : "Add Lecture"}
                      </Button>
                    )}

                    {show && (
                      <form onSubmit={submitHandler} className="space-y-4 mb-4">
                        <Input
                          type="text"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                        <Input
                          type="text"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                        <Input
                          type="file"
                          onChange={changeVideoHandler}
                          required
                        />
                        {videoPrev && <video src={videoPrev} width="300" controls />}
                        <Button
                          type="submit"
                          disabled={btnLoading}
                          className={s.button}
                        >
                          {btnLoading ? "Uploading..." : "Add"}
                        </Button>
                      </form>
                    )}

                    <ScrollArea className={s.scrollArea}>
                      {lectures.map((lec, index) => (
                        <div key={lec._id} className="mb-2">
                          <div
                            onClick={() => fetchLecture(lec._id)}
                            className="p-2 cursor-pointer hover:bg-purple-200 rounded transition-colors"
                          >
                            <span>
                              {index + 1}. {lec.title}
                            </span>
                            {progress?.completedLectures?.includes(lec._id) && (
                              <TiTick className="text-green-500 ml-2 inline" />
                            )}
                          </div>
                          {user?.role === "teacher" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteHandler(lec._id)}
                              className={s.button}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lecture;
