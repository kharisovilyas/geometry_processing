package ru.ilcorp.geometry_processing.v1.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CubeController {
    @GetMapping("/")
    public String geometryProcessingCube(Model model) {
        model.addAttribute("size", 100); // Размер куба
        return "cube";
    }
}
