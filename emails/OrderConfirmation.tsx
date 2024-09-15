import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface EmailTemplateProps {
  firstName: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ""

export const OrderConfirmation = ({ firstName }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Sowgreen Farms Receipt</Preview>

    <Body className="bg-white font-sans">
      <Container className="mx-auto py-5 w-[660px] max-w-full">
        {/* Header Section */}
        <Section>
          <Row>
            <Column>
              <Img
                src={`${baseUrl}/static/apple-logo.png`}
                width="42"
                height="42"
                alt="Apple Logo"
              />
            </Column>
            <Column className="text-right">
              <Text className="text-4xl font-light text-gray-500">Receipt</Text>
            </Column>
          </Row>
        </Section>

        {/* Offer Section */}
        <Section>
          <Text className="text-center my-9 text-sm font-medium text-black">
            Save 3% on all your Apple purchases with Apple Card.
            <sup className="font-light">1</sup>{" "}
            <Link
              href="https://www.apple.com/apple-card"
              className="text-blue-600 underline"
            >
              Apply and use in minutes
            </Link>
            <sup className="font-light">2</sup>
          </Text>
        </Section>

        {/* Information Table */}
        <Section className="bg-gray-50 rounded-md text-sm text-gray-900">
          <Row className="h-[46px]">
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column className="pl-5 border border-white border-b-0">
                    <Text className="text-xs text-gray-600">APPLE ID</Text>
                    <Link className="text-blue-600 underline">
                      alan.turing@gmail.com
                    </Link>
                  </Column>
                </Row>
                <Row>
                  <Column className="pl-5 border border-white border-b-0">
                    <Text className="text-xs text-gray-600">INVOICE DATE</Text>
                    <Text className="text-sm">18 Jan 2023</Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="pl-5 border border-white border-b-0">
                    <Text className="text-xs text-gray-600">ORDER ID</Text>
                    <Link className="text-blue-600 underline">ML4F5L8522</Link>
                  </Column>
                  <Column className="pl-5 border border-white border-b-0">
                    <Text className="text-xs text-gray-600">DOCUMENT NO.</Text>
                    <Text className="text-sm">186623754793</Text>
                  </Column>
                </Row>
              </Section>
            </Column>
            <Column className="pl-5 border border-white border-b-0" colSpan={2}>
              <Text className="text-xs text-gray-600">BILLED TO</Text>
              <Text className="text-sm">Visa .... 7461 (Apple Pay)</Text>
              <Text className="text-sm">Alan Turing</Text>
              <Text className="text-sm">2125 Chestnut St</Text>
              <Text className="text-sm">San Francisco, CA 94123</Text>
              <Text className="text-sm">USA</Text>
            </Column>
          </Row>
        </Section>

        {/* Product Section */}
        <Section className="bg-gray-50 rounded-md mt-7">
          <Text className="bg-gray-50 pl-2 text-sm font-medium">App Store</Text>
        </Section>
        <Section>
          <Row>
            <Column className="w-[64px]">
              <Img
                src={`${baseUrl}/static/apple-hbo-max-icon.jpeg`}
                width="64"
                height="64"
                alt="HBO Max"
                className="rounded-xl border border-gray-300"
              />
            </Column>
            <Column className="pl-5">
              <Text className="text-sm font-semibold">
                HBO Max: Stream TV & Movies
              </Text>
              <Text className="text-sm text-gray-600">
                HBO Max Ad-Free (Monthly)
              </Text>
              <Text className="text-sm text-gray-600">Renews Aug 20, 2023</Text>
              <div className="flex">
                <Link
                  href="https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview"
                  className="text-blue-600 text-sm"
                >
                  Write a Review
                </Link>
                <span className="mx-2">|</span>
                <Link
                  href="https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/reportAProblem"
                  className="text-blue-600 text-sm"
                >
                  Report a Problem
                </Link>
              </div>
            </Column>
            <Column className="text-right">
              <Text className="text-sm font-semibold">$14.99</Text>
            </Column>
          </Row>
        </Section>

        {/* Total Section */}
        <Hr className="my-7" />
        <Section className="text-right">
          <Row>
            <Column className="text-right">
              <Text className="text-xs font-semibold text-gray-600">TOTAL</Text>
            </Column>
            <Column className="border-l border-gray-200"></Column>
            <Column className="text-right">
              <Text className="text-lg font-semibold">$14.99</Text>
            </Column>
          </Row>
        </Section>
        <Hr className="my-7" />

        {/* Footer Section */}
        <Section>
          <Row className="text-center">
            <Column>
              <Img
                src={`${baseUrl}/static/apple-card-icon.png`}
                width="60"
                height="17"
                alt="Apple Card"
              />
            </Column>
          </Row>
        </Section>

        <Section>
          <Row className="text-center">
            <Column>
              <Text className="text-2xl font-medium">
                Save 3% on all your Apple purchases.
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Wallet Section */}
        <Section className="text-center">
          <Row>
            <Column>
              <Link
                href="https://wallet.apple.com/apple-card/setup"
                className="text-blue-600 no-underline"
              >
                <Img
                  src={`${baseUrl}/static/apple-wallet.png`}
                  width="28"
                  height="28"
                  alt="Apple Wallet"
                  className="inline pr-2 align-middle"
                />
                <span className="text-sm font-normal">
                  Apply and use in minutes
                </span>
              </Link>
            </Column>
          </Row>
        </Section>
        <Hr className="my-16" />

        {/* Footer Links */}
      </Container>
    </Body>
  </Html>
)

export default OrderConfirmation
