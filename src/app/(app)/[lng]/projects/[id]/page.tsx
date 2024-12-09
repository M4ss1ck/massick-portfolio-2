"use server";
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectDetails } from '@/components/ProjectDetails';

const Page = async (props: {
    params: Promise<{
        lng: string,
        id: string | number
    }>
}) => {
    const params = await props.params;
    const {
        id
    } = params;

    return (
        <main className="flex flex-col items-center justify-start w-full min-h-screen gap-2">
            <Navbar />
            <ProjectDetails id={id} />
            <Footer />
        </main>
    )
}

export default Page