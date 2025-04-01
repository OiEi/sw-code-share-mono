package task

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Task struct {
	Color    string `json:"color"`
	Grade    string `json:"grade"`
	Text     string `json:"text"`
	Solution string `json:"solution"`
}

type Tasks map[string][]Task

func GetTasks() Tasks {
	tasks := make(map[string][]Task)

	tasksPath := os.Getenv("TASKS_PATH")
	if tasksPath == "" {
		tasksPath = "./tasks" // путь по умолчанию в контейнере
	}

	dirs, err := os.ReadDir(tasksPath)
	if err != nil {
		fmt.Printf("Error reading tasks directory: %v\n", err)
		return tasks
	}

	for _, dir := range dirs {
		if !dir.IsDir() {
			continue
		}

		dirName := dir.Name()
		dirPath := filepath.Join(tasksPath, dirName)

		//read from subd
		files, err := os.ReadDir(dirPath)
		if err != nil {
			fmt.Printf("Error reading directory %s: %v\n", dirPath, err)
			continue
		}

		for _, file := range files {
			if file.IsDir() || !strings.HasSuffix(file.Name(), ".json") {
				continue
			}

			//get "color" for task
			fileName := file.Name()
			color := strings.Split(fileName, "_")[0]

			filePath := filepath.Join(dirPath, fileName)

			data, err := os.ReadFile(filePath)
			if err != nil {
				fmt.Printf("Error reading file %s: %v\n", filePath, err)
				continue
			}

			var task Task
			if err := json.Unmarshal(data, &task); err != nil {
				fmt.Printf("Error parsing JSON from file %s: %v\n", filePath, err)
				continue
			}

			task.Color = color
			tasks[dir.Name()] = append(tasks[dir.Name()], task)
		}
	}

	return tasks
}
