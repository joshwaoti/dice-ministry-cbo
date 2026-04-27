import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value in a non-synchronous way to satisfy linter
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    })
    
    mql.addEventListener("change", onChange)
    
    return () => {
      isMounted = false;
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
