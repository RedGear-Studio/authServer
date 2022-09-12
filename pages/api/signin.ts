

import type { NextApiRequest, NextApiResponse } from "next"
import { login, exist } from "../../lib/sqlLogin";
import NodeRSA from "node-rsa"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        //Getting email and password from body
        const { password, username } = req.body;
        //Validate
        if (!password || !username) {
            res.status(422).json({ message: 'Invalid Data' });
            return;
        }
        
        const result = await login({ password, username })
        if(result){
            const key = new NodeRSA({b: 512});
            const exported = key.exportKey('components')

            res.status(201).json({ message: 'success', data: exported});
        }else{
            res.status(401).json({ message: 'Bad identifiers'});
        }
        
    } else {
        res.status(500).json({ message: 'Route not valid' });
    }
}