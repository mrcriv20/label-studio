import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import type { Product } from '../types'

const POSITIONS = {
  nameTop: 44.5,
  nameHeight: 16,
  priceTop: 63,
  priceHeight: 11,
  barcodeTop: 77,
  barcodeHeight: 14,
  barcodeLeft: 8,
  barcodeWidth: 84,
}

interface Props {
  product: Partial<Product>
  templateDataUri: string
  barcodeOverrideDataUri?: string
  scale?: number
}

export default function LabelPreview({
  product,
  templateDataUri,
  barcodeOverrideDataUri,
  scale = 1,
}: Props): JSX.Element {
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!barcodeRef.current || !product.barcodeValue || barcodeOverrideDataUri) return
    try {
      JsBarcode(barcodeRef.current, product.barcodeValue, {
        format: 'CODE128',
        width: 1.8,
        height: 48,
        displayValue: true,
        fontSize: 9,
        margin: 2,
        background: 'transparent',
        lineColor: '#1a2332',
      })
    } catch {
      // invalid barcode value
    }
  }, [product.barcodeValue, barcodeOverrideDataUri])

  const name = product.name || 'Product Name'
  const price = product.price || '$0.00'
  const nameFontSize = name.length > 22 ? '4.8cqw' : name.length > 14 ? '5.8cqw' : '7cqw'
  const priceFontSize = price.length > 10 ? '6cqw' : '8cqw'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '181 / 289',
        overflow: 'hidden',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        background: '#f5f0e8',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
        containerType: 'inline-size',
      }}
    >
      {/* Template background */}
      {templateDataUri ? (
        <img
          src={templateDataUri}
          alt="Label template"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
          draggable={false}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94a3b8' }}>
          Template not found
        </div>
      )}

      {/* White mask over the editable content area */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '3.5%',
          right: '3.5%',
          bottom: '3%',
          background: 'white',
          borderRadius: '4%',
          pointerEvents: 'none',
        }}
      />

      {/* Product name */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${POSITIONS.nameTop}%`,
          height: `${POSITIONS.nameHeight}%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 5%',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: nameFontSize,
            fontFamily: '"Lora", Georgia, serif',
            fontWeight: 700,
            color: '#1a2332',
            textAlign: 'center',
            lineHeight: 1.2,
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {name}
        </span>
      </div>

      {/* Price */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${POSITIONS.priceTop}%`,
          height: `${POSITIONS.priceHeight}%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 5%',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: priceFontSize,
            fontFamily: '"Genty Demo", Georgia, serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#1a2332',
            textAlign: 'center',
          }}
        >
          {price}
        </span>
      </div>

      {/* Barcode */}
      <div
        style={{
          position: 'absolute',
          top: `${POSITIONS.barcodeTop}%`,
          height: `${POSITIONS.barcodeHeight}%`,
          left: `${POSITIONS.barcodeLeft}%`,
          width: `${POSITIONS.barcodeWidth}%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {barcodeOverrideDataUri ? (
          <img
            src={barcodeOverrideDataUri}
            alt="Barcode"
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        ) : (
          <svg ref={barcodeRef} style={{ maxHeight: '100%', maxWidth: '100%' }} />
        )}
      </div>
    </div>
  )
}
