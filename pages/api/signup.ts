

import type { NextApiRequest, NextApiResponse } from "next"
import { create, exist } from "../../lib/sqlLogin";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        //Getting email and password from body
        const { email, password, username } = req.body;
        //Validate
        if (!email || !email.includes('@') || !password || !username) {
            res.status(422).json({ message: 'Invalid Data' });
            return;
        }
        const anOtherAcount = await exist({ email, username })
        if(anOtherAcount){
            return res.status(409).json({ message: 'An other account exist' });
        }
        const result = await create({ email, password, username })
        res.status(201).json({ message: 'User created'});
    } else {
        res.status(500).json({ message: 'Route not valid' });
    }
}