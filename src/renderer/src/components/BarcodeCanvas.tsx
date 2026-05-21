import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

interface Props {
  value: string
  width?: number
  height?: number
  className?: string
}

export default function BarcodeCanvas({
  value,
  width = 2,
  height = 60,
  className = '',
}: Props): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !value) return
    try {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        width,
        height,
        displayValue: true,
        fontSize: 10,
        margin: 4,
        background: 'transparent',
        lineColor: '#1a2332',
      })
    } catch {
      // invalid barcode value — leave blank
    }
  }, [value, width, height])

  return <svg ref={svgRef} className={`barcode-canvas ${className}`} />
}
