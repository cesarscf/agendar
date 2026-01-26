import { type ClassValue, clsx } from "clsx";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// ============================================
// FORMATAÇÃO DE PREÇOS E VALORES
// ============================================

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * Usado para exibição de valores em interfaces
 * @param price - Valor numérico ou string
 * @returns String formatada como moeda (ex: "R$ 1.234,56")
 */
export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === "string" ? Number(price) : price;

  if (Number.isNaN(numericPrice)) {
    return typeof price === "string" ? price : String(price);
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericPrice);
}

/**
 * Formata centavos para moeda brasileira (R$)
 * Usado para exibir valores que vêm do backend em centavos
 * @param price - Valor em centavos como string (ex: "123456")
 * @returns String formatada como moeda (ex: "R$ 1.234,56")
 */
export function formatPriceFromCents(price: string) {
  const numberPrice = Number(price) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberPrice);
}

/**
 * Converte o valor unmasked do MaskInput para centavos
 * Usado ao enviar dados de formulários com MaskInput para o backend
 * @param unmaskedValue - Valor sem máscara do MaskInput (ex: "1234.56")
 * @returns String com valor em centavos (ex: "123456")
 */
export function convertUnmaskedToCents(unmaskedValue: string): string {
  if (!unmaskedValue) return "0";
  const normalized = unmaskedValue.replace(",", ".");
  const float = parseFloat(normalized);
  if (Number.isNaN(float)) return "0";
  return String(Math.round(float * 100));
}

/**
 * Converte centavos para o formato esperado pelo MaskInput
 * Usado ao carregar dados do backend (em centavos) para o MaskInput
 * @param cents - Valor em centavos como string (ex: "123456")
 * @returns Valor formatado para o MaskInput (ex: "1234.56")
 */
export function convertCentsToUnmasked(cents: string): string {
  const value = Number(cents);
  if (Number.isNaN(value)) return "0";
  return (value / 100).toFixed(2);
}

// ============================================
// FORMATAÇÃO DE DURAÇÃO
// ============================================

/**
 * Formata minutos para string legível (ex: "1h 30min")
 * @param minutes - Número de minutos
 * @returns String formatada
 */
export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}min`
    : `${hours}h`;
}

/**
 * Converte string de duração para número
 * @param duration - String com duração em minutos
 * @returns Número de minutos
 */
export function parseDuration(duration: string): number {
  return parseInt(duration, 10);
}

/**
 * Converte número de minutos para string
 * @param duration - Número de minutos
 * @returns String com o número
 */
export function formatDurationToString(duration: number): string {
  return String(duration);
}

// ============================================
// UTILITÁRIOS GERAIS
// ============================================

/**
 * Remove todos os caracteres não numéricos de uma string
 * @param str - String de entrada
 * @returns String contendo apenas números
 */
export function onlyNumbers(str: string): string {
  return str.replace(/\D/g, "");
}

// ============================================
// FORMATAÇÃO DE DATAS E HORÁRIOS
// ============================================

export const weekdays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export const weekdaysWithValue = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

/**
 * Formata uma data usando date-fns
 * @param dateInput - Data como string ou objeto Date
 * @param formatString - Formato desejado
 * @returns Data formatada
 */
export function formatDate(
  dateInput: string | Date,
  formatString: string,
): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return format(date, formatString, { locale: ptBR });
}

/**
 * Gera array de horários disponíveis (de meia em meia hora)
 * @returns Array com horários no formato "HH:mm"
 */
export function generateTimeOptions() {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
}

/**
 * Converte string de data BR para objeto Date
 * @param value - Data no formato "dd/mm/yyyy"
 * @returns Objeto Date
 */
export function parseDateString(value: string): Date {
  const [day, month, year] = value.split("/");
  const date = new Date(`${year}-${month}-${day}`);

  if (Number.isNaN(date.getTime())) throw new Error("Data inválida");
  return date;
}

/**
 * Formata ISO para data brasileira
 * @param iso - String ISO
 * @returns Data no formato "dd/mm/yyyy"
 */
export function formatIsoToDateBr(iso: string) {
  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formata intervalo de datas
 * @param startDate - Data inicial (ISO)
 * @param endDate - Data final (ISO)
 * @returns Range formatado (ex: "01/01/2024 - 31/01/2024")
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = formatIsoToDateBr(startDate);
  const end = formatIsoToDateBr(endDate);
  return `${start} - ${end}`;
}

/**
 * Converte data brasileira para ISO
 * @param dateBr - Data no formato "dd/mm/yyyy"
 * @returns String ISO
 */
export function parseDateBrToIso(dateBr: string): string {
  if (!dateBr) return "";
  const parsed = parse(dateBr, "dd/MM/yyyy", new Date());
  return parsed.toISOString();
}

/**
 * Converte Date para string ISO de data (sem horário)
 * @param date - Objeto Date
 * @returns String no formato "yyyy-MM-dd"
 */
export function toISODateString(date: Date) {
  return format(date, "yyyy-MM-dd");
}

// ============================================
// TEMAS E CORES
// ============================================

export const themeOptions = [
  { label: "Vermelho", value: "red", color: "#ef4444" },
  { label: "Verde", value: "green", color: "#22c55e" },
  { label: "Azul", value: "blue", color: "#3b82f6" },
  { label: "Roxo", value: "purple", color: "#8b5cf6" },
  { label: "Amarelo", value: "yellow", color: "#eab308" },
  { label: "Laranja", value: "orange", color: "#ff6900" },
];

// ============================================
// FORMATAÇÃO DE COMISSÃO
// ============================================

/**
 * Converte comissão do banco de dados (centavos) para porcentagem
 * @param value - Valor em centavos (ex: "1050" = 10.50%)
 * @returns String com porcentagem (ex: "10.50")
 */
export function commissionFromDatabase(value: string): string {
  const num = Number(value);
  if (Number.isNaN(num)) return "0";
  return (num / 100).toFixed(2);
}

/**
 * Converte porcentagem para formato do banco de dados (centavos)
 * @param value - Porcentagem como string (ex: "10.50" ou "10,50")
 * @returns String em centavos (ex: "1050")
 */
export function commissionToDatabase(value: string): string {
  const num = Number(value.replace(",", "."));
  if (Number.isNaN(num)) return "0";
  return Math.round(num * 100).toString();
}

// ============================================
// FORMATAÇÃO DE NOMES
// ============================================

/**
 * Abrevia o nome completo mantendo o primeiro nome e a inicial do segundo nome
 * @param fullName - Nome completo (ex: "Cesar Silva Pereira")
 * @returns Nome abreviado (ex: "Cesar S.")
 */
export function abbreviateName(fullName: string): string {
  if (!fullName || typeof fullName !== "string") return "";

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  const firstName = parts[0];
  const secondNameInitial = `${parts[1].charAt(0).toUpperCase()}.`;

  return `${firstName} ${secondNameInitial}`;
}

// ============================================
// TIMEZONE CONVERSION UTILITIES
// ============================================

/**
 * Convert time string from local timezone to UTC
 * Example: "17:00" in UTC-3 becomes "20:00" in UTC
 * @param time - Time string in format "HH:mm" in local timezone
 * @returns Time string in UTC format "HH:mm"
 */
export const convertLocalTimeToUTC = (time: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);
  // Create a date with the local time
  const localDate = new Date();
  localDate.setHours(hours, minutes, 0, 0);

  // Get the UTC time (this automatically applies the timezone offset)
  const utcHours = localDate.getUTCHours().toString().padStart(2, "0");
  const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, "0");

  return `${utcHours}:${utcMinutes}`;
};

/**
 * Convert time string from UTC to local timezone
 * Example: "20:00" in UTC becomes "17:00" in UTC-3
 * @param time - Time string in format "HH:mm" in UTC
 * @returns Time string in local timezone format "HH:mm"
 */
export const convertUTCToLocalTime = (time: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);
  // Create a date with UTC time
  const utcDate = new Date();
  utcDate.setUTCHours(hours, minutes, 0, 0);

  // Get the local time (this automatically applies the timezone offset)
  const localHours = utcDate.getHours().toString().padStart(2, "0");
  const localMinutes = utcDate.getMinutes().toString().padStart(2, "0");

  return `${localHours}:${localMinutes}`;
};

/**
 * Convert local Date object to UTC Date
 * The returned Date has the same moment in time, but will be rendered in UTC
 * @param localDate - Date object in local timezone
 * @returns Date object representing the same moment in UTC
 */
export function convertLocalDateToUTC(localDate: Date): Date {
  // Simply return the same Date object - JavaScript Date objects are always in UTC internally
  // When we call toISOString(), it will give us the correct UTC representation
  return localDate;
}

/**
 * Convert UTC ISO string to local Date object
 * @param utcString - ISO string representing UTC date/time
 * @returns Date object that represents the same moment in time
 */
export function convertUTCStringToLocal(utcString: string): string {
  // JavaScript Date constructor already handles ISO strings correctly
  // Just parse and return as ISO string - the Date object handles timezone internally
  return new Date(utcString).toISOString();
}
