import { FileText } from 'lucide-react'
import React from 'react'

const Logo = () => {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">InvoSmart</span>
        </div>
    )
}

export default Logo