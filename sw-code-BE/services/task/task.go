package task

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

type Task struct {
	Name     string `json:"name"`
	Color    string `json:"color"`
	Grade    string `json:"grade"`
	Text     string `json:"text"`
	Solution string `json:"solution"`
}

type Tasks map[string]map[string][]Task

// TODO порефачь, накидано на ходу
func GetTasks() Tasks {
	tasks := make(map[string]map[string][]Task)

	tasksPath := os.Getenv("TASKS_PATH")
	if tasksPath == "" {
		tasksPath = "./tasks" // путь по умолчанию в контейнере
	}

	langDirs, err := os.ReadDir(tasksPath)
	if err != nil {
		fmt.Printf("Error reading tasks directory: %v\n", err)
		return tasks
	}

	//папки языков
	for _, langDir := range langDirs {
		if !langDir.IsDir() {
			continue
		}

		langDirName := langDir.Name()
		langDirPath := filepath.Join(tasksPath, langDirName)

		langTasksDirs, err := os.ReadDir(langDirPath)
		if err != nil {
			fmt.Printf("Error reading tasks directory: %v\n", err)
			return tasks
		}

		for _, langTasksDir := range langTasksDirs {
			if !langDir.IsDir() {
				continue
			}

			langTasksDirName := langTasksDir.Name()
			langTaskDirPath := filepath.Join(langDirPath, langTasksDirName)
			files, err := os.ReadDir(langTaskDirPath)
			if err != nil {
				fmt.Printf("Error reading directory %s: %v\n", langDirPath, err)
				continue
			}

			for _, file := range files {
				if file.IsDir() || !strings.HasSuffix(file.Name(), ".json") {
					continue
				}

				//get taskColor and name
				fileName := file.Name()
				trimmedFileName := strings.TrimSuffix(fileName, ".json")
				splitFileName := strings.Split(trimmedFileName, "_")

				var taskColor, taskName string

				if len(splitFileName) < 2 {
					log.Printf("Task file name invalid, skipping task %s\n", fileName)
					continue
				}

				taskColor = splitFileName[0]
				taskName = strings.Join(splitFileName[1:], " ")

				filePath := filepath.Join(langTaskDirPath, fileName)

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

				task.Color = taskColor
				task.Name = taskName

				if tasks[langDirName] == nil {
					tasks[langDirName] = make(map[string][]Task)
				}

				tasks[langDirName][langTasksDirName] = append(tasks[langDirName][langTasksDirName], task)
			}
		}

	}

	return tasks
}
