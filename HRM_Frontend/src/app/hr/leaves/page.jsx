"use client"
import React from 'react';
import LeaveForm from '../../../../components/LeaveForm';
import withAuth from '@/app/withAuth';

const Page = () => {


    return (
        <div>
            <LeaveForm />
        </div>
    );
}

export default withAuth(Page)
