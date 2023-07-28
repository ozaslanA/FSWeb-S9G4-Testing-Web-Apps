import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

import React from "react";
import {
  findByLabelText,
  findByTestId,
  fireEvent,
  getByAltText,
  getByTestId,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  // Arrange
  render(<IletisimFormu />);
  //Act
  const iletisimFormu = screen.getByText(/gönder/i);
  // Assert
  expect(iletisimFormu).toBeInTheDocument();
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const title = screen.getByTestId("header");
  expect(title).toBeTruthy(); //döndürülen değer header mı?
  expect(title).toHaveTextContent(/İletişim Formu/i); // başlık doğru test içeriğine sahip mi?
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const isim = await screen.findByTestId("name");
  fireEvent.change(isim, {
    target: { value: "ce" },
  });
  await waitFor(() => {
    expect(isim.value).toBe("ce");
  });

  //screen.debug();
  expect(screen.getByTestId("error")).toHaveTextContent(
    /Hata: ad en az 5 karakter olmalıdır./i
  );
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);
  //screen.debug();
  expect(
    screen.getAllByText(
      /Hata: ad en az 5 karakter olmalıdır./i,
      /Hata: soyad gereklidir./i,
      /Hata: email geçerli bir email adresi olmalıdır./i
    )
  );
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Ceylin");
  const soyad = await screen.findByTestId("surname");
  userEvent.type(soyad, "Yaşar");
  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);
  expect(screen.getByText(/Hata: email geçerli bir email adresi olmalıdır./i));
  //screen.debug(
  // screen.getByText(/Hata: email geçerli bir email adresi olmalıdır./i)
  //);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "ceylin@ceylin");
  //screen.debug();
  expect(screen.getByText(/Hata: email geçerli bir email adresi olmalıdır./i));
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Ceylin");
  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "ceylin@ceylin.com");
  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);
  expect(screen.getByText(/Hata: soyad gereklidir./i));
  //   screen.debug(screen.getByText(/Hata: soyad gereklidir./i));
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Ceylin");
  const soyad = await screen.findByTestId("surname");
  userEvent.type(soyad, "Yaşar");
  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "ceylin@ceylin.com");
  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);
  const hata = screen.queryByTestId("error");
  expect(hata).not.toBeInTheDocument();
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<App />);
  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Ceylin");
  const soyad = await screen.findByTestId("surname");
  userEvent.type(soyad, "Yaşar");
  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "ceylin@ceylin.com");
  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);
  const displayer = screen.getByTestId("gönderilen");
  expect(displayer).toBeInTheDocument();
});
