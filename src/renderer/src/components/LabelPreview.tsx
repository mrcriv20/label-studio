import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import JsBarcode from 'jsbarcode'
import type { Product } from '../types'
import {
  getLabelTemplate,
  LOGO_ONLY_LABEL_ZONES,
  INFO_LABEL_ZONES,
  LABEL_HEIGHT,
  LABEL_WIDTH,
  LABEL_ZONES,
  VERTICAL_INFO_LABEL_ZONES,
  toPercentHeight,
  toPercentTop,
  toPercentWidth,
  toPercentX,
} from '../../../shared/labelTemplates'

const DEFAULT_TOP_LOGO_SRC = new URL('../../../../assets/default-label-logo.png', import.meta.url).href

interface Props {
  product: Partial<Product>
  barcodeOverrideDataUri?: string
  logoDataUri?: string
  scale?: number
}

export default function LabelPreview({
  product,
  barcodeOverrideDataUri,
  logoDataUri,
  scale = 1,
}: Props): JSX.Element {
  const barcodeRef = useRef<SVGSVGElement>(null)
  const template = getLabelTemplate(product.templateId)
  const [globalLabelBackground, setGlobalLabelBackground] = useState('')
  const labelBackground = product.labelBackgroundColor || globalLabelBackground || template.shellColor
  const resolvedProduct = { ...product, labelBackgroundColor: labelBackground }

  useEffect(() => {
    window.api.settings.get().then((result) => {
      if (result.ok) setGlobalLabelBackground(result.data.labelBackgroundColor)
    })
  }, [])

  useEffect(() => {
    if (!barcodeRef.current || !product.barcodeValue || barcodeOverrideDataUri || product.showBarcode === false) return
    try {
      JsBarcode(barcodeRef.current, product.barcodeValue, {
        format: 'CODE128',
        width: template.layout === 'info' ? 1.2 : 1.6,
        height: template.layout === 'info' ? 28 : 34,
        displayValue: true,
        fontSize: template.layout === 'info' ? 7 : 8,
        margin: 1,
        background: 'transparent',
        lineColor: template.textColor,
      })
    } catch {
      // invalid barcode value
    }
  }, [barcodeOverrideDataUri, product.barcodeValue, product.showBarcode, template.layout, template.textColor])

  if (template.layout === 'info') {
    return (
      <InfoLabelPreview
        product={resolvedProduct}
        template={template}
        barcodeRef={barcodeRef}
        barcodeOverrideDataUri={barcodeOverrideDataUri}
        logoDataUri={logoDataUri}
        scale={scale}
      />
    )
  }

  if (template.layout === 'vertical-info') {
    return (
      <VerticalInfoLabelPreview
        product={resolvedProduct}
        template={template}
        logoDataUri={logoDataUri}
        scale={scale}
      />
    )
  }

  if (template.layout === 'logo-only') {
    return (
      <LogoOnlyLabelPreview
        template={template}
        logoDataUri={logoDataUri}
        scale={scale}
        labelBackground={labelBackground}
      />
    )
  }

  return (
    <FrontLabelPreview
      product={resolvedProduct}
      template={template}
      barcodeRef={barcodeRef}
      barcodeOverrideDataUri={barcodeOverrideDataUri}
      logoDataUri={logoDataUri}
      scale={scale}
    />
  )
}

function FrontLabelPreview({
  product,
  template,
  barcodeRef,
  barcodeOverrideDataUri,
  logoDataUri,
  scale,
}: {
  product: Partial<Product>
  template: ReturnType<typeof getLabelTemplate>
  barcodeRef: RefObject<SVGSVGElement | null>
  barcodeOverrideDataUri?: string
  logoDataUri?: string
  scale: number
}): JSX.Element {
  const name = product.name || 'Product Name'
  const price = product.price || '$13.99'
  const nameFontSize = name.length > 30 ? '4.6cqw' : name.length > 18 ? '5.4cqw' : '6.6cqw'
  const priceFontSize = price.length > 10 ? '6.6cqw' : '8.2cqw'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: 'hidden',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.16)',
        background: product.labelBackgroundColor || template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
        containerType: 'inline-size',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, border: `1px solid ${template.borderColor}`, borderRadius: 18, pointerEvents: 'none' }} />

      <TopImage
        logoDataUri={logoDataUri}
        x={LABEL_ZONES.topImage.x}
        y={LABEL_ZONES.topImage.y}
        w={LABEL_ZONES.topImage.w}
        h={LABEL_ZONES.topImage.h}
        canvasWidth={template.width}
        canvasHeight={template.height}
      />

      <div
        style={{
          position: 'absolute',
          top: toPercentTop(LABEL_ZONES.contentPanel.y, LABEL_ZONES.contentPanel.h, template.height),
          left: toPercentX(LABEL_ZONES.contentPanel.x, template.width),
          width: toPercentWidth(LABEL_ZONES.contentPanel.w, template.width),
          height: toPercentHeight(LABEL_ZONES.contentPanel.h, template.height),
          background: template.panelColor,
          borderRadius: 12,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: toPercentTop(LABEL_ZONES.name.y, LABEL_ZONES.name.h, template.height),
          left: toPercentX(LABEL_ZONES.name.x, template.width),
          width: toPercentWidth(LABEL_ZONES.name.w, template.width),
          height: toPercentHeight(LABEL_ZONES.name.h, template.height),
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 2%',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: nameFontSize,
            fontFamily: 'var(--label-title-font, "Lora", Georgia, serif)',
            fontWeight: 700,
            color: template.textColor,
            textAlign: 'center',
            lineHeight: 1.05,
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {name}
        </span>
      </div>

      {product.showPrice !== false && (
        <div
          style={{
            position: 'absolute',
            top: toPercentTop(LABEL_ZONES.price.y, LABEL_ZONES.price.h, template.height),
            left: toPercentX(LABEL_ZONES.price.x, template.width),
            width: toPercentWidth(LABEL_ZONES.price.w, template.width),
            height: toPercentHeight(LABEL_ZONES.price.h, template.height),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: priceFontSize,
              fontFamily: 'var(--label-price-font, "Genty Demo", Georgia, serif)',
              fontWeight: 400,
              color: template.textColor,
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            {price}
          </span>
        </div>
      )}

      <BarcodeBlock
        visible={product.showBarcode !== false}
        barcodeRef={barcodeRef}
        barcodeOverrideDataUri={barcodeOverrideDataUri}
        x={LABEL_ZONES.barcode.x}
        y={LABEL_ZONES.barcode.y}
        w={LABEL_ZONES.barcode.w}
        h={LABEL_ZONES.barcode.h}
        canvasWidth={template.width}
        canvasHeight={template.height}
      />
    </div>
  )
}

function InfoLabelPreview({
  product,
  template,
  barcodeRef,
  barcodeOverrideDataUri,
  logoDataUri,
  scale,
}: {
  product: Partial<Product>
  template: ReturnType<typeof getLabelTemplate>
  barcodeRef: RefObject<SVGSVGElement | null>
  barcodeOverrideDataUri?: string
  logoDataUri?: string
  scale: number
}): JSX.Element {
  const name = product.name || 'Product Name'
  const price = product.price || '$8.99'
  const infoCopySize = 'clamp(6px, 2.9cqw, 10.67px)'
  const infoHeadingSize = 'clamp(6px, 3.2cqw, 12px)'
  const infoNameSize = 'clamp(6px, 4.2cqw, 12px)'
  const infoPriceSize = 'clamp(6px, 4.2cqw, 12px)'
  const infoBodyFontFamily = '"Avenir Next Condensed Asset", "Avenir Next Condensed", "Avenir Next", "Arial Narrow", Arial, sans-serif'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: 'hidden',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.16)',
        background: product.labelBackgroundColor || template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
        containerType: 'inline-size',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, border: `2px solid ${template.borderColor}`, borderRadius: 18, pointerEvents: 'none' }} />

      <TopImage
        logoDataUri={logoDataUri}
        x={INFO_LABEL_ZONES.topImage.x}
        y={INFO_LABEL_ZONES.topImage.y}
        w={INFO_LABEL_ZONES.topImage.w}
        h={INFO_LABEL_ZONES.topImage.h}
        canvasWidth={template.width}
        canvasHeight={template.height}
      />

      <div
        style={{
          position: 'absolute',
          top: toPercentTop(INFO_LABEL_ZONES.infoPanel.y, INFO_LABEL_ZONES.infoPanel.h, template.height),
          left: toPercentX(INFO_LABEL_ZONES.infoPanel.x, template.width),
          width: toPercentWidth(INFO_LABEL_ZONES.infoPanel.w, template.width),
          height: toPercentHeight(INFO_LABEL_ZONES.infoPanel.h, template.height),
          background: template.infoPanelColor ?? '#fff',
          borderRadius: 12,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: toPercentTop(INFO_LABEL_ZONES.leftName.y, INFO_LABEL_ZONES.leftName.h, template.height),
          left: toPercentX(INFO_LABEL_ZONES.leftName.x, template.width),
          width: toPercentWidth(INFO_LABEL_ZONES.leftName.w, template.width),
          height: toPercentHeight(INFO_LABEL_ZONES.leftName.h, template.height),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 2%',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: infoNameSize,
            fontFamily: 'var(--label-title-font, "Lora", Georgia, serif)',
            fontWeight: 700,
            color: template.textColor,
            lineHeight: 1.05,
          }}
        >
          {name}
        </span>
      </div>

      {product.showPrice !== false && (
        <div
          style={{
            position: 'absolute',
            top: toPercentTop(INFO_LABEL_ZONES.leftPrice.y, INFO_LABEL_ZONES.leftPrice.h, template.height),
            left: toPercentX(INFO_LABEL_ZONES.leftPrice.x, template.width),
            width: toPercentWidth(INFO_LABEL_ZONES.leftPrice.w, template.width),
            height: toPercentHeight(INFO_LABEL_ZONES.leftPrice.h, template.height),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: infoPriceSize,
              fontFamily: 'var(--label-price-font, "Genty Demo", Georgia, serif)',
              fontWeight: 400,
              color: template.textColor,
              lineHeight: 1,
            }}
          >
            {price}
          </span>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: toPercentTop(INFO_LABEL_ZONES.infoText.y, INFO_LABEL_ZONES.infoText.h, template.height),
          left: toPercentX(INFO_LABEL_ZONES.infoText.x, template.width),
          width: toPercentWidth(INFO_LABEL_ZONES.infoText.w, template.width),
          height: toPercentHeight(INFO_LABEL_ZONES.infoText.h, template.height),
          color: template.textColor,
          fontFamily: 'var(--label-body-font, "Helvetica Neue", Arial, sans-serif)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <InfoSection
          title="Nutrition Facts:"
          body={joinInfo(product.servingInfo, product.nutritionInfo)}
          bodySize={infoCopySize}
          titleSize={infoHeadingSize}
          bodyFontFamily={infoBodyFontFamily}
        />
        {product.showCookingInstructions !== false && (
          <InfoSection
            title="Cooking Instructions"
            body={product.cookingInstructions || 'Add cooking instructions'}
            bodySize={infoCopySize}
            titleSize={infoHeadingSize}
            bodyFontFamily={infoBodyFontFamily}
          />
        )}
        <InfoSection
          title="Ingredients:"
          body={product.ingredients || 'Add ingredients'}
          bodySize={infoCopySize}
          titleSize={infoHeadingSize}
          bodyFontFamily={infoBodyFontFamily}
        />
        {!!product.allergenStatement && (
          <p style={{ margin: '1.8cqw 0 0', fontSize: infoCopySize, lineHeight: 1.25, fontStyle: 'italic', color: '#3f3f46', fontFamily: infoBodyFontFamily }}>
            {product.allergenStatement}
          </p>
        )}
      </div>

      <BarcodeBlock
        visible={product.showBarcode !== false}
        barcodeRef={barcodeRef}
        barcodeOverrideDataUri={barcodeOverrideDataUri}
        x={INFO_LABEL_ZONES.barcode.x}
        y={INFO_LABEL_ZONES.barcode.y}
        w={INFO_LABEL_ZONES.barcode.w}
        h={INFO_LABEL_ZONES.barcode.h}
        canvasWidth={template.width}
        canvasHeight={template.height}
      />
    </div>
  )
}

function VerticalInfoLabelPreview({
  product,
  template,
  logoDataUri,
  scale,
}: {
  product: Partial<Product>
  template: ReturnType<typeof getLabelTemplate>
  logoDataUri?: string
  scale: number
}): JSX.Element {
  const name = product.name || 'Product Title'
  const titleSize = name.length > 26 ? '4.8cqw' : name.length > 16 ? '5.8cqw' : '6.8cqw'
  const showCookingInstructions = product.showCookingInstructions !== false
  const cookingCopy = product.cookingInstructions || 'Add cooking instructions'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: 'hidden',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.16)',
        background: product.labelBackgroundColor || template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
        containerType: 'inline-size',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, border: `1px solid ${template.borderColor}`, borderRadius: 18, pointerEvents: 'none' }} />

      <TopImage
        logoDataUri={logoDataUri}
        x={VERTICAL_INFO_LABEL_ZONES.topImage.x}
        y={VERTICAL_INFO_LABEL_ZONES.topImage.y}
        w={VERTICAL_INFO_LABEL_ZONES.topImage.w}
        h={VERTICAL_INFO_LABEL_ZONES.topImage.h}
        canvasWidth={template.width}
        canvasHeight={template.height}
      />

      <div
        style={{
          position: 'absolute',
          top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.contentPanel.y, VERTICAL_INFO_LABEL_ZONES.contentPanel.h, template.height),
          left: toPercentX(VERTICAL_INFO_LABEL_ZONES.contentPanel.x, template.width),
          width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.contentPanel.w, template.width),
          height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.contentPanel.h, template.height),
          background: template.panelColor,
          borderRadius: 12,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.title.y, VERTICAL_INFO_LABEL_ZONES.title.h, template.height),
          left: toPercentX(VERTICAL_INFO_LABEL_ZONES.title.x, template.width),
          width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.title.w, template.width),
          height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.title.h, template.height),
          display: 'flex',
          alignItems: showCookingInstructions ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: '0 2%',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: titleSize,
            fontFamily: 'var(--label-title-font, "Lora", Georgia, serif)',
            fontWeight: 700,
            color: template.textColor,
            textAlign: 'center',
            lineHeight: 1.02,
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {name}
        </span>
      </div>

      {showCookingInstructions && (
        <>
          <div
            style={{
              position: 'absolute',
              top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.cookingTitle.y, VERTICAL_INFO_LABEL_ZONES.cookingTitle.h, template.height),
              left: toPercentX(VERTICAL_INFO_LABEL_ZONES.cookingTitle.x, template.width),
              width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.cookingTitle.w, template.width),
              height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.cookingTitle.h, template.height),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '3.6cqw',
                fontFamily: 'var(--label-body-font, "Helvetica Neue", Arial, sans-serif)',
                fontWeight: 700,
                color: template.textColor,
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              Cooking Instructions
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.cookingBody.y, VERTICAL_INFO_LABEL_ZONES.cookingBody.h, template.height),
              left: toPercentX(VERTICAL_INFO_LABEL_ZONES.cookingBody.x, template.width),
              width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.cookingBody.w, template.width),
              height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.cookingBody.h, template.height),
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontSize: '2.8cqw',
                fontFamily: 'var(--label-body-font, "Avenir Next Condensed Asset", Arial, sans-serif)',
                fontWeight: 400,
                color: template.textColor,
                textAlign: 'center',
                lineHeight: 1.16,
                whiteSpace: 'pre-wrap',
              }}
            >
              {cookingCopy}
            </span>
          </div>
        </>
      )}

      {product.customerName?.trim() && (
        <div
          style={{
            position: 'absolute',
            top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.customerName.y, VERTICAL_INFO_LABEL_ZONES.customerName.h, template.height),
            left: toPercentX(VERTICAL_INFO_LABEL_ZONES.customerName.x, template.width),
            width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.customerName.w, template.width),
            height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.customerName.h, template.height),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontSize: '2.8cqw',
              fontFamily: 'var(--label-body-font, "Helvetica Neue", Arial, sans-serif)',
              fontWeight: 700,
              color: template.textColor,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Order: {product.customerName.trim()}
          </span>
        </div>
      )}
    </div>
  )
}

function LogoOnlyLabelPreview({
  template,
  logoDataUri,
  scale,
  labelBackground,
}: {
  template: ReturnType<typeof getLabelTemplate>
  logoDataUri?: string
  scale: number
  labelBackground: string
}): JSX.Element {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: 'hidden',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.16)',
        background: labelBackground,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
        containerType: 'inline-size',
      }}
    >
      <TopImage
        logoDataUri={logoDataUri}
        x={LOGO_ONLY_LABEL_ZONES.topImage.x}
        y={LOGO_ONLY_LABEL_ZONES.topImage.y}
        w={LOGO_ONLY_LABEL_ZONES.topImage.w}
        h={LOGO_ONLY_LABEL_ZONES.topImage.h}
        canvasWidth={template.width}
        canvasHeight={template.height}
      />
    </div>
  )
}

function TopImage({
  logoDataUri,
  x,
  y,
  w,
  h,
  canvasWidth,
  canvasHeight,
}: {
  logoDataUri?: string
  x: number
  y: number
  w: number
  h: number
  canvasWidth: number
  canvasHeight: number
}): JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        top: toPercentTop(y, h, canvasHeight),
        left: toPercentX(x, canvasWidth),
        width: toPercentWidth(w, canvasWidth),
        height: toPercentHeight(h, canvasHeight),
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <img
        src={logoDataUri || DEFAULT_TOP_LOGO_SRC}
        alt="Top label image"
        style={{ width: 'auto', height: '100%', margin: '0 auto', display: 'block' }}
        draggable={false}
      />
    </div>
  )
}

function BarcodeBlock({
  visible,
  barcodeRef,
  barcodeOverrideDataUri,
  x,
  y,
  w,
  h,
  canvasWidth,
  canvasHeight,
}: {
  visible: boolean
  barcodeRef: RefObject<SVGSVGElement | null>
  barcodeOverrideDataUri?: string
  x: number
  y: number
  w: number
  h: number
  canvasWidth: number
  canvasHeight: number
}): JSX.Element | null {
  if (!visible) return null
  return (
    <div
      style={{
        position: 'absolute',
        top: toPercentTop(y, h, canvasHeight),
        left: toPercentX(x, canvasWidth),
        width: toPercentWidth(w, canvasWidth),
        height: toPercentHeight(h, canvasHeight),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {barcodeOverrideDataUri ? (
        <img src={barcodeOverrideDataUri} alt="Barcode" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        <svg ref={barcodeRef} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  )
}

function InfoSection({
  title,
  body,
  bodySize,
  titleSize = 'clamp(6px, 3.2cqw, 12px)',
  bodyFontFamily,
}: {
  title: string
  body: string
  bodySize: string
  titleSize?: string
  bodyFontFamily?: string
}): JSX.Element {
  return (
    <div style={{ marginBottom: '2cqw' }}>
      <p style={{ margin: 0, fontSize: titleSize, fontWeight: 700, lineHeight: 1.2 }}>{title}</p>
      <p style={{ margin: '0.4cqw 0 0', fontSize: bodySize, lineHeight: 1.25, whiteSpace: 'pre-wrap', fontFamily: bodyFontFamily }}>{body}</p>
    </div>
  )
}

function joinInfo(servingInfo?: string, nutritionInfo?: string): string {
  return [servingInfo, nutritionInfo].filter(Boolean).join(' | ') || 'Add serving and nutrition info'
}
