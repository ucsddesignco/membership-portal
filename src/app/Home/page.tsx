import Link from "next/link";

export const Home = () => {
    return(
      <main className="min-h-screen "> 
        <div className="mx-auto flex flex-col">
          <header className="flex flex-row justify-between px-6 py-4 border-2 border-white-300 rounded-[8px]">
            <div>
              <h1 className="text-[1.5rem]">Home</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="#">Events</Link>
              <Link href="#">Admin</Link>
              <Link href="#">Main Website</Link>
              <Link href="#">Settings</Link>
            </nav>
          </header>
          <section className="grid grid-cols-3 gap-6"> 

            {/** Column 1 */}
            <div className="flex flex-col col-span-1 gap-8 pt-8 pb-16 pl-16 "> 
              {/** Profile Picture */}
              <div className="flex flex-col gap-2 items-center h-72">
                <div className="flex flex-col gap-2 h-48 w-48 items-center justify-center rounded-full bg-white">
                  <div className="h-12 w-12 justify-center rounded-full bg-black"></div>
                  <div className="h-8 w-24 justify-center rounded-t-[36px] bg-black"></div>
                  <span className="font-light text-black">UserUser</span>
                </div>
                <p className="text-[2rem]">Welcome, Name!</p>
              </div>

              <div className="flex h-72 items-center justify-center border-2 border-white-300 rounded-[8px]">
                <h3>this week?</h3>
              </div>
            </div>

            {/** Column 2 */} 
            <div className="flex flex-col gap-8 col-span-2 bg-red pt-8 pr-16 pb-16"> 
              {/** Slideshow */}
              <div className="flex h-72 items-center justify-center border-2 border-white-300 rounded-[8px]">
                <h3>Slideshow</h3>
              </div>

              {/** Lower section */}
              <div className="grid grid-cols-2 gap-6 h-72">

                {/** Weekly Quests*/}
                <div className="flex items-center justify-center border-2 border-white-300 rounded-[8px]">
                  <h3>Weekly Quests</h3>
                </div>

                {/** Leaderboard Container */}
                <div className="flex flex-col border-2 border-white-300 rounded-[8px]">
                  <div className="flex justify-center border-b-2 border-white-300 p-4">
                    <h3>LeaderBoard, top 5</h3>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <p>content</p>
                  </div>
                </div>
              </div>
            </div> 
          </section>
        </div>
      </main>


    )
}

export default Home;