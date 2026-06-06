package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type AnswerRequest struct {
	Answer   string `json:"answer"`
	Activity string `json:"activity"`
}

func main() {
	http.HandleFunc("/api/answer", answerHandler)

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	log.Println("Сайт запущен: http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func answerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AnswerRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	message := fmt.Sprintf(
		"💌 Новый ответ с сайта\n\nХочет на свидание: %s\nВыбор еды: %s\nВремя: %s",
		req.Answer,
		req.Activity,
		time.Now().Format("02.01.2006 15:04"),
	)

	err = sendTelegramMessage(message)
	if err != nil {
		log.Println("telegram error:", err)
		http.Error(w, "telegram error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}

func sendTelegramMessage(text string) error {
	botToken := os.Getenv("BOT_TOKEN")
	chatID := os.Getenv("CHAT_ID")

	if botToken == "" || chatID == "" {
		return fmt.Errorf("BOT_TOKEN or CHAT_ID is empty")
	}

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)

	body := map[string]string{
		"chat_id": chatID,
		"text":    text,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("telegram status: %s", resp.Status)
	}

	return nil
}
