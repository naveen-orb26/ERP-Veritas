export default function InfoCard({

    title,

    children,

}:{

    title:string

    children:React.ReactNode

}){

    return(

        <div
            className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-6
            "
        >

            <h2
                className="
                    mb-4
                    text-lg
                    font-semibold
                "
            >

                {title}

            </h2>

            {children}

        </div>

    )

}