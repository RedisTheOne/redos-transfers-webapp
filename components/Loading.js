import Head from 'next/head'
import style from '../styles/loading/Loading.module.scss'

export default function Loading() {
    return (
        <div className={style.container}>
            <Head>
                <title>LOADING...</title>
            </Head>
            <h1>Loading</h1>
        </div>
    )
}