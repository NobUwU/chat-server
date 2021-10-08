import React, {
  FC,
  useState,
  useRef,
  useEffect,
} from 'react'
import {
  channelsState,
  usersState,
  messagesState,
} from '../state/index'
import { useRecoilState } from 'recoil'
import { Channel as RestChannel } from '../types/index'
import axios from 'axios'

import Navbar from '../components/Navbar'
import Channel from '../components/Channel'

import "./Home.scss"

const analogy = [
  "When you say 'Forward' or 'Back', your lips move in those directions.",
  "People who are goodlooking but have terrible personalities are basically real life click baits.",  
  "The Japanese flag could actually be a pie chart of how much of Japan is Japan.",
  "When you clean out a vacuum cleaner, you become a vacuum cleaner.",
  "Beef jerky is basically a meat raisin.",
  "Holes are completely empty, yet wholes are completely full.",
  "Every truck is a food truck if you're a cannibal.",
  `Why do people say "tuna fish" when they don't say "beef mammal" or "chicken bird"?`,
  "Why aren't iPhone chargers called apple juice?",
]

const Loader: FC = () => {
  return (
    <div id="loader">
      <div className="l-bar l-bar1"></div>
      <div className="l-bar l-bar2"></div>
      <div className="l-bar l-bar3"></div>
      <div className="l-bar l-bar4"></div>
      <div className="l-bar l-bar5"></div>
      <div className="l-bar l-bar6"></div>
      <div className="l-bar l-bar7"></div>
      <div className="l-bar l-bar8"></div>
      <div className="l-bar l-bar9"></div>
      <div className="l-bar l-bar10"></div>
    </div>
  )
}

const Analogy: FC<{ items: string[] }> = (s: { items: string[] }) => {
  const [j, cj] = useState<string>(s.items[Math.floor(Math.random() * s.items.length)])

  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.classList.add("out")
      setTimeout(() => {
        const cur = s.items.indexOf(j)
        let next = s.items[cur + 1]
        if (!next) next = s.items[0]

        cj(next)
        ref.current?.classList.remove("out")
      }, 1100)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [j])

  return (
    <div id="analogy">
      <p ref={ref}>{j}</p>
    </div>
  )
}

const Home: FC = () => {
  const [l, setL] = useState<boolean>(true)
  const [channels, setC] = useRecoilState(channelsState)
  const [messages, setM] = useRecoilState(messagesState)
  const [users, setU] = useRecoilState(usersState)

  const loading = useRef<HTMLDivElement>()
  useEffect(() => {
    async function dowit() {
      const channels = await axios.get("/api/channels")
      const messages = await axios.get("/api/allmessages")
      const users = await axios.get("/api/users")
      setC(channels.data.channels)
      setM(messages.data.messages)
      setU(users.data.users)
      isReady()
    }
    function isReady() {
      setTimeout(() => {
        loading.current?.classList.add("anim-out")
        setTimeout(() => {
          setL(false)
        }, 1100)
      }, 2000)
    }
    dowit().catch(console.error)
  }, [])

  return (
    <div id="home">
      {
        l
          ? <div id="loading-screen" ref={loading}>
            <Loader />
            <Analogy items={analogy} />
          </div>
          : ""
      }
      <div className="nav">
        <Navbar />
      </div>
      <div className="channel">
        <Channel />
      </div>
    </div>
  )
}

export default Home
