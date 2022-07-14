import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from '../context/auth-context'
export const useHttpClient = () => {

    const authCtx = useContext(AuthContext)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const activeHttpRequests = useRef([])

    const sendRequest = useCallback(async (url, httpAbortCtrl, method = 'GET', body = null, headers = {}) => {
      
        setIsLoading(true)

        activeHttpRequests.current.push(httpAbortCtrl)
        try {
            const response = await fetch(url, {
                method,
                body,
                headers: {
                    ...headers,
                    'Accept-Language': authCtx.language,                    
                    
                },
                signal: httpAbortCtrl.signal
            })

            const responseData = await response.json()

            activeHttpRequests.current = activeHttpRequests.current.filter(reqctrl => reqctrl !== httpAbortCtrl)

            if (!response.ok) {
               
                if (responseData.validationErrors) {

                    throw new Error(JSON.stringify(responseData.validationErrors))
                } else if (responseData.emailErrorMessage) {

                    const serverError = {
                        emailErrorMessage: responseData.emailErrorMessage
                    }
                    throw new Error(JSON.stringify(serverError))
                } else {

                    const serverError = {
                        serverMessage: responseData.message
                    }
                    throw new Error(JSON.stringify(serverError))
                }
            }

            setIsLoading(false)
            return responseData
        } catch (err) {

            if (!httpAbortCtrl.signal.aborted) {

                setError(err.message)
                setIsLoading(false)
                throw err
            }
        }

    }, [authCtx.language])

    const clearError = () => {
        setError(null)
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])

    return {
        isLoading,
        error,
        sendRequest,
        clearError
    }
}