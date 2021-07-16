import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TaxForm from "../components/taxForm";
import axios from "axios";

interface iHome {
    data: any
}
const Home: React.FC<{data: any}> = ({data}) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Tax Caculator</title>
                {/*<link rel="icon" href="/favicon.ico" />*/}

            </Head>

            <TaxForm data={data}/>
        </div>
    )
}

export default Home

export async  function getServerSideProps() {
    const response = await axios.get("https://gist.githubusercontent.com/michaelrbock/a2176b86cb58e2c885898cb426d6933d/raw/3b66438da09cd51ce0292f94ac92f3ccff67831d/state-taxes.json")

    response.data

    return {
        props: {
            data: response.data
        }
    }
}
