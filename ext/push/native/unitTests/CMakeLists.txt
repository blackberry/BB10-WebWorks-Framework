cmake_minimum_required(VERSION 2.8)

if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-Werror -lang-c++ -fexceptions ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-Werror ${CMAKE_C_FLAGS}")
endif ()

include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common)
include_directories(${CMAKE_SOURCE_DIR}/dependencies/JsonCpp/jsoncpp-src-0.5.0/include)
include_directories(${CMAKE_SOURCE_DIR}/dependencies/gmock-1.5.0/fused-src/)

set(srcs
    test_main.cpp
    ../push_js.cpp
    ../push_ndk.cpp
    ../../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_reader.cpp
    ../../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_value.cpp
    ../../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_writer.cpp
    ../../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common/plugin.cpp
    ../../../../dependencies/gmock-1.5.0/fused-src/gmock-gtest-all.cc
)

add_executable(pushJNextTest ${srcs})

target_link_libraries(pushJNextTest PushService bps)
set_target_properties(pushJNextTest PROPERTIES PREFIX "" OUTPUT_NAME "test")

