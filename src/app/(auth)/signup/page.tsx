import { SignupForm } from '@/components/signup-form'
import { auth } from '@/server/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Fragment } from 'react/jsx-runtime'

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session) {
        redirect('/user')
    }
    return (
        <Fragment>
            <SignupForm />
        </Fragment>
    )
}
