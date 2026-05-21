import Link from "next/link";

export const JoinUs = () => {
    return(
        <section className="flex flex-col jusitify-center items-center max-w-[900px] sm:items-start m-auto">
            <h1 className="text-[3rem] leading-tight">Where creativity meets community.</h1>
            <p className="text-[1.5rem] mt-2 font-light">
                Join Design Co to stay updated on events, workshops, design oppertunties, 
                and connect with a growing community of creative students.
             </p>

             <div className="flex gap-3 mt-5">
                <Link href="/LogIn" className="bg-white px-[2rem] py-[1rem] text-black">log in</Link>
                <Link href="/SignUp" className="bg-white px-[2rem] py-[1rem] text-black">sign up</Link>
             </div>
        </section>
    )
}

export default JoinUs;