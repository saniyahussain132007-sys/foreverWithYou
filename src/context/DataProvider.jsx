import React, { createContext, useContext, useState, useEffect } from "react";

// --- DYNAMIC DATA OBJECT (Default Fallback) ---
const defaultData = {
  name: "Saniya",
  heroHeading: "babuiii ek chiz dikhau dekhoge aap?",
  romanticAudio: "romantic.mp3",
  birthdayAudio: "birthday.mp3",
  birthdayText: "Happy Birthday ❤️",
  letter: [
    "Pata hai, kabhi kabhi lagta hai life kitni simple thi… phir tum aaye aur sab kuch special ban gaya. Tum sirf ek insaan nahi ho mere liye… tum meri <span class=\"highlight\">aadat</span> ban gaye ho, meri smile ka reason ho, aur mera safe place bhi.",
    "Mere <span class=\"highlight\">babuu</span>… jab bhi tum mujhe hasate ho na, lagta hai duniya ki saari tension khatam ho gayi. Aur mera cute sa <span class=\"highlight\">babuii</span>, tumhari choti choti baatein hi meri sabse badi khushi hain.",
    "Mere <span class=\"highlight\">januu</span>, tumhare bina sab adhura lagta hai… sach me. Aur haan, mera pyara sa <span class=\"highlight\">baccha</span>, tum khud nahi jaante kitne special ho mere liye.",
    "<span class=\"highlight\" style=\"font-size: 1.5rem\">I love you…</span> hamesha ❤️"
  ],
  images: [
    { src: "pic1.jpg", caption: "My favorite moment with you ❤️", isFavorite: true },
    { src: "pic2.jpg", caption: "Our first memory ❤️", isFavorite: false },
    { src: "pic3.jpg", caption: "You + Me = Forever 💕", isFavorite: false }
  ],
  reasons: [
    { front: "Your smile 😊", back: "Because it makes even my worst days feel like a dream.", special: false },
    { front: "Your anger 😂", back: "Even when you're 'angry', you look the absolute cutest.", special: false },
    { front: "The way you care", back: "You look after me in ways I didn't even know I needed.", special: false },
    { front: "How you understand me", back: "I don't even have to say a word, and you already know.", special: false },
    { front: "The way you stay", back: "Through every high and low, you are my constant.", special: false },
    { front: "Because you are YOU ❤️", back: "I love you... simply because there's no one else like you.", special: true }
  ],
  noButtonMessages: ["Nhi dekhoge aap?", "Gandi baat 😒", "YES Click kro n!", "Motuuu plz 😂" , "nhi kr rhe aap click" , "chalo fir pakad ke dikhao" , "dikhao dikhao.."],
  letterIntro: "Happy Birthday meri jaan ❤️",
  vowText: "No matter what...<br />I’ll always choose you ❤️"
};

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in preview mode
    const isPreview = window.location.pathname.endsWith('/preview');

    if (isPreview) {
      // Preview mode: load from localStorage directly
      try {
        const local = localStorage.getItem("romanticData");
        if (local) {
          setData(JSON.parse(local));
        } else {
          setData(defaultData);
        }
      } catch (e) {
        console.error("localStorage failed, using defaultData", e);
        setData(defaultData);
      }
      setLoading(false);
      return;
    }

    // Normal mode: check for ?id= param and load from Firebase
    import("../firebase").then(({ db }) => {
      const loadWebsiteData = async () => {
        try {
          const params = new URLSearchParams(window.location.search);
          const id = params.get("id");

          if (id) {
            db.ref("websites/" + id).once("value")
              .then(snapshot => {
                const fetchedData = snapshot.val();
                if (fetchedData) {
                  setData(fetchedData);
                } else {
                  console.log("No data found");
                  fallbackData();
                }
              }).catch(error => {
                console.error("Firebase failed:", error);
                fallbackData();
              }).finally(() => {
                setLoading(false);
              });
          } else {
            fallbackData();
            setLoading(false);
          }
        } catch (e) {
          console.error("Critical error loading data:", e);
          fallbackData();
          setLoading(false);
        }
      };

      const fallbackData = () => {
        try {
          const local = localStorage.getItem("romanticData");
          if (local) {
            setData(JSON.parse(local));
          } else {
            setData(defaultData);
          }
        } catch (e) {
          console.error("localStorage failed, using defaultData", e);
          setData(defaultData);
        }
      };

      loadWebsiteData();
    });
  }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export { defaultData };
